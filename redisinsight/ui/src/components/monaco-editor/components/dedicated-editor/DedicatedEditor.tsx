import React, { useContext, useEffect, useRef, useState } from 'react'
import { compact, findIndex, first } from 'lodash'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import ReactMonacoEditor, { monaco as monacoEditor } from 'react-monaco-editor'
import { Rnd } from 'react-rnd'
import cx from 'classnames'
import { EuiButtonIcon } from '@elastic/eui'

import {
  decoration,
  getMonacoAction,
  MonacoAction,
  Nullable,
  toModelDeltaDecoration
} from 'uiSrc/utils'
import { DEDICATED_EDITOR_LANGUAGES, DSL, MonacoLanguage, Theme } from 'uiSrc/constants'
import { IEditorMount } from 'uiSrc/pages/workbench/interfaces'
import { ThemeContext } from 'uiSrc/contexts/themeContext'

import styles from './styles.module.scss'

export interface Props {
  query?: string
  langId?: DSL
  langs?: DSL[]
  onSubmit: (query?: string) => void
  onCancel: () => void
  initialHeight: number
}

// paddings of main editor
const WRAPPER_PADDINGS_HEIGHT = 18
const BOTTOM_INDENT_PADDING = 6

const notCommandRegEx = /^\s|\/\//
let decorationCollection: Nullable<monacoEditor.editor.IEditorDecorationsCollection> = null

const DedicatedEditor = (props: Props) => {
  const { initialHeight, query = '', langId, langs = [], onCancel, onSubmit } = props
  const selectedLang = DEDICATED_EDITOR_LANGUAGES[!langs.length ? langId! : first(langs)!]

  const [value, setValue] = useState<string>(query)
  const [height, setHeight] = useState(initialHeight)
  const monacoObjects = useRef<Nullable<IEditorMount>>(null)
  const rndRef = useRef<Nullable<any>>(null)

  const { theme } = useContext(ThemeContext)

  let disposeCompletionItemProvider = () => {}

  useEffect(() =>
  // componentWillUnmount
    () => {
      disposeCompletionItemProvider()
    },
  [])

  useEffect(() => {
    if (height === 0) return

    const rndHeight = rndRef.current?.resizableElement.current.offsetHeight || 0
    const rndTop = rndRef.current?.draggable.state.y
    if (height < rndTop + rndHeight + WRAPPER_PADDINGS_HEIGHT) {
      rndRef?.current.updatePosition({ x: 0, y: height - rndHeight - WRAPPER_PADDINGS_HEIGHT })
    }
  }, [height])

  useEffect(() => {
    if (!monacoObjects.current) return
    const commands = value.split('\n')
    const { monaco } = monacoObjects.current

    const newDecorations = compact(commands.map((command, index) => {
      if (!command || notCommandRegEx.test(command)) return null
      const lineNumber = index + 1

      return toModelDeltaDecoration(
        decoration(monaco, `decoration_${lineNumber}`, lineNumber, 1, lineNumber, 1)
      )
    }))

    decorationCollection?.set(newDecorations)
  }, [value])

  const onResize = ({ height }: Size): void => {
    setHeight(height!)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleSubmit = () => {
    const { editor } = monacoObjects?.current || {}
    const val = editor?.getValue()
      .split('\n')
      .map((line: string, i: number) => ((i > 0 && !notCommandRegEx.test(line)) ? `\t${line}` : line))
      .join('\n')
    onSubmit(val || '')
  }

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    monacoObjects.current = { editor, monaco }

    setTimeout(() => editor.focus(), 0)

    setupMonacoLang(monaco)
    editor.addAction(
      getMonacoAction(MonacoAction.Submit, () => handleSubmit(), monaco)
    )

    decorationCollection = editor.createDecorationsCollection()
  }

  const setupMonacoLang = (monaco: typeof monacoEditor) => {
    const languages = monaco.languages.getLanguages()

    if (!selectedLang) return

    const isLangRegistered = findIndex(languages, { id: selectedLang.id }) > -1
    if (isLangRegistered) {
      return
    }
    monaco.languages.register({ id: selectedLang.id })

    monaco.languages.setLanguageConfiguration(selectedLang.id, selectedLang.config!)

    disposeCompletionItemProvider = monaco.languages.registerCompletionItemProvider(
      selectedLang.id,
      selectedLang.completionProvider?.()!
    ).dispose

    monaco.languages.setMonarchTokensProvider(
      selectedLang.id,
      selectedLang.tokensProvider?.()!
    )
  }

  const options: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
    tabCompletion: 'on',
    wordWrap: 'on',
    padding: { top: 10 },
    automaticLayout: true,
    formatOnPaste: false,
    suggest: {
      preview: false,
      showStatusBar: false,
      showIcons: true,
    },
    minimap: {
      enabled: false
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    lineNumbersMinChars: 4
  }

  return (
    <AutoSizer onResize={onResize}>
      {() => (
        <div className="editorBounder">
          <Rnd
            ref={rndRef}
            default={{
              x: 0,
              y: initialHeight * 0.4 - BOTTOM_INDENT_PADDING,
              width: '100%',
              height: '60%'
            }}
            minHeight="80px"
            enableResizing={{
              top: true,
              right: false,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            resizeHandleClasses={{
              top: 't_resize-top',
              bottom: 't_resize-bottom'
            }}
            dragAxis="y"
            bounds=".editorBounder"
            dragHandleClassName="draggable-area"
            className={styles.rnd}
            data-testid="draggable-area"
          >
            <div className={styles.container} onKeyDown={handleKeyDown} role="textbox" tabIndex={0}>
              <div className="draggable-area" />
              <div className={styles.input} data-testid="query-input-container">
                <ReactMonacoEditor
                  language={selectedLang?.id || MonacoLanguage.Cypher}
                  theme={theme === Theme.Dark ? 'dark' : 'light'}
                  value={value}
                  onChange={setValue}
                  options={options}
                  className={`${langId}-editor`}
                  editorDidMount={editorDidMount}
                />
              </div>
              <div className={cx(styles.actions)}>
                <span>{ selectedLang?.name }</span>
                <div>
                  <EuiButtonIcon
                    iconSize="m"
                    iconType="cross"
                    color="primary"
                    aria-label="Cancel editing"
                    className={styles.declineBtn}
                    onClick={onCancel}
                    data-testid="cancel-btn"
                  />
                  <EuiButtonIcon
                    iconSize="m"
                    iconType="check"
                    color="primary"
                    type="submit"
                    aria-label="Apply"
                    onClick={handleSubmit}
                    className={styles.applyBtn}
                    data-testid="apply-btn"
                  />
                </div>
              </div>
            </div>
          </Rnd>
        </div>
      )}
    </AutoSizer>
  )
}

export default React.memo(DedicatedEditor)