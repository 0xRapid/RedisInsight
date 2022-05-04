import { cloneDeep } from 'lodash'
import React from 'react'

import {
  cleanup,
  fireEvent,
  sessionStorageMock,
  mockedStore,
  render,
  screen,
  waitFor,
} from 'uiSrc/utils/test-utils'
import { BrowserStorageItem } from 'uiSrc/constants'
import { processCliClient, resetCliSettings, toggleCli } from 'uiSrc/slices/cli/cli-settings'
import { connectedInstanceSelector } from 'uiSrc/slices/instances/instances'
import { sessionStorageService } from 'uiSrc/services'
import { resetOutputLoading } from 'uiSrc/slices/cli/cli-output'
import CliHeader from './CliHeader'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

jest.mock('uiSrc/slices/instances/instances', () => ({
  ...jest.requireActual('uiSrc/slices/instances/instances'),
  connectedInstanceSelector: jest.fn().mockReturnValue({
    host: 'localhost',
    port: 6379,
  }),
}))

jest.mock('uiSrc/services', () => ({
  ...jest.requireActual('uiSrc/services'),
  sessionStorageService: {
    set: jest.fn(),
    get: jest.fn(),
  },
}))

describe('CliHeader', () => {
  it('should render', () => {
    expect(render(<CliHeader />)).toBeTruthy()
  })

  it('should "resetCliSettings" action be called after click "close-cli" button', () => {
    render(<CliHeader />)
    fireEvent.click(screen.getByTestId('close-cli'))

    const expectedActions = [resetCliSettings(), resetOutputLoading()]
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should "resetCliSettings" action be called after click "close-cli" button', async () => {
    const mockUuid = 'test-uuid'
    sessionStorageMock.getItem = jest.fn().mockReturnValue(mockUuid)

    render(<CliHeader />)

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('close-cli'))
    })

    const expectedActions = [resetCliSettings(), resetOutputLoading()]
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should "toggleCli" action be called after click "hide-cli" button', () => {
    render(<CliHeader />)
    fireEvent.click(screen.getByTestId('hide-cli'))

    const expectedActions = [toggleCli()]
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should "toggleCli" action be called after click "hide-cli" button', async () => {
    const mockUuid = 'test-uuid'
    sessionStorageMock.getItem = jest.fn().mockReturnValue(mockUuid)

    render(<CliHeader />)

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('hide-cli'))
    })

    const expectedActions = [toggleCli()]
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('Cli endpoint should be equal connected Instance host:port', () => {
    const host = 'localhost'
    const port = 6379
    const endpoint = `${host}:${port}`
    const mockEndpoint = `cli-endpoint-${endpoint}`

    connectedInstanceSelector.mockImplementation(() => ({
      host,
      port,
    }))

    const { queryByTestId } = render(<CliHeader />)

    const endpointEl = queryByTestId(mockEndpoint)

    expect(endpointEl).toBeInTheDocument()
    expect(endpointEl).toHaveTextContent(endpoint)
  })
})

it('should "processCliClient" action be called after close cli with mocked sessionStorage item ', async () => {
  const mockUuid = 'test-uuid'
  sessionStorageService.get = jest.fn().mockReturnValue(mockUuid)

  render(<CliHeader />)

  await waitFor(() => {
    fireEvent.click(screen.getByTestId('close-cli'))
  })

  expect(sessionStorageService.get).toBeCalledWith(BrowserStorageItem.cliClientUuid)

  const expectedActions = [
    processCliClient(),
    resetCliSettings(),
    resetOutputLoading(),
  ]
  expect(store.getActions()).toEqual(expectedActions)
})
