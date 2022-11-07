import {
  EuiButtonEmpty,
  EuiOutsideClickDetector,
  EuiSuperSelect,
  EuiSuperSelectOption,
} from '@elastic/eui'
import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { isString } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import {
  setSelectedIndex,
  redisearchSelector,
  redisearchListSelector,
  fetchRedisearchListAction,
} from 'uiSrc/slices/browser/redisearch'
import { connectedInstanceSelector } from 'uiSrc/slices/instances/instances'
import { KeyViewType } from 'uiSrc/slices/interfaces/keys'
import { fetchKeys, keysSelector } from 'uiSrc/slices/browser/keys'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import { bufferToString, formatLongName, Nullable } from 'uiSrc/utils'
import { SCAN_COUNT_DEFAULT, SCAN_TREE_COUNT_DEFAULT } from 'uiSrc/constants/api'

import styles from './styles.module.scss'

export const CREATE = 'create'

export interface Props {
  onCreateIndex: (value: boolean) => void
}

const RediSearchIndexesList = (props: Props) => {
  const { onCreateIndex } = props

  const { viewType, searchMode } = useSelector(keysSelector)
  const { selectedIndex = '' } = useSelector(redisearchSelector)
  const { data: list = [], loading } = useSelector(redisearchListSelector)
  const { id: instanceId } = useSelector(connectedInstanceSelector)

  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<Nullable<string>>(JSON.stringify(selectedIndex))

  const dispatch = useDispatch()

  useEffect(() => {
    setIndex(JSON.stringify(selectedIndex || ''))
  }, [selectedIndex])

  useEffect(() => {
    dispatch(fetchRedisearchListAction())
  }, [])

  const options: EuiSuperSelectOption<string>[] = list.map(
    (index) => {
      const value = formatLongName(bufferToString(index))

      return {
        value: JSON.stringify(index),
        inputDisplay: value,
        dropdownDisplay: value,
        'data-test-subj': `mode-option-type-${value}`,
      }
    }
  )

  options.unshift({
    value: JSON.stringify(CREATE),
    inputDisplay: CREATE,
    dropdownDisplay: (
      <div className={styles.createIndexBtn} data-testid="create-index-btn">Create Index</div>
    )
  })

  const onChangeIndex = (initValue: string) => {
    const value = JSON.parse(initValue)

    if (isString(value) && value === CREATE) {
      onCreateIndex(true)
      setIsSelectOpen(false)

      sendEventTelemetry({
        event: TelemetryEvent.SEARCH_INDEX_ADD_BUTTON_CLICKED,
        eventData: {
          databaseId: instanceId
        }
      })

      return
    }

    setIndex(initValue)
    setIsSelectOpen(false)

    dispatch(setSelectedIndex(value))
    dispatch(fetchKeys(
      searchMode,
      '0',
      viewType === KeyViewType.Browser ? SCAN_COUNT_DEFAULT : SCAN_TREE_COUNT_DEFAULT,
    ))

    sendEventTelemetry({
      event: TelemetryEvent.SEARCH_INDEX_ADD_BUTTON_CLICKED,
      eventData: {
        databaseId: instanceId,
        totalNumberOfIndexes: list.length
      }
    })
  }

  return (
    <EuiOutsideClickDetector
      onOutsideClick={() => setIsSelectOpen(false)}
    >
      <div className={cx(styles.container)}>
        <EuiSuperSelect
          fullWidth
          itemClassName={cx('withColorDefinition', styles.searchMode)}
          disabled={loading}
          isLoading={loading}
          options={options}
          isOpen={isSelectOpen}
          valueOfSelected={index || ''}
          onChange={onChangeIndex}
          data-testid="select-search-mode"
        />
        {!selectedIndex && (
          <EuiButtonEmpty
            className={styles.placeholder}
            onClick={() => setIsSelectOpen(true)}
            data-testid="select-index-placeholder"
          >
            Select Index
          </EuiButtonEmpty>
        )}
      </div>
    </EuiOutsideClickDetector>
  )
}

export default RediSearchIndexesList