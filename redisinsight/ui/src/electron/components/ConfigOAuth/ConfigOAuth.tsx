import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  createFreeDbJob,
  fetchPlans,
  fetchUserInfo,
  setJob,
  setOAuthCloudSource,
  setSignInDialogState,
  setSocialDialogState,
  showOAuthProgress,
  signInFailure,
} from 'uiSrc/slices/oauth/cloud'
import { BrowserStorageItem, Pages } from 'uiSrc/constants'
import { cloudSelector, fetchSubscriptionsRedisCloud, setSSOFlow } from 'uiSrc/slices/instances/cloud'
import { CloudAuthResponse, CloudAuthStatus, CloudJobName, CloudJobStep } from 'uiSrc/electron/constants'
import { addErrorNotification, addInfiniteNotification, removeInfiniteNotification } from 'uiSrc/slices/app/notifications'
import { parseCloudOAuthError } from 'uiSrc/utils'
import { INFINITE_MESSAGES, InfiniteMessagesIds } from 'uiSrc/components/notifications/components'
import { localStorageService } from 'uiSrc/services'
import { CustomError } from 'uiSrc/slices/interfaces'

const ConfigOAuth = () => {
  const { ssoFlow, isRecommendedSettings } = useSelector(cloudSelector)

  const ssoFlowRef = useRef(ssoFlow)
  const isRecommendedSettingsRef = useRef(isRecommendedSettings)

  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    window.app?.cloudOauthCallback?.(cloudOauthCallback)

    // delete
    // dispatch(fetchUserInfo(fetchUserInfoSuccess))
  }, [])

  useEffect(() => {
    ssoFlowRef.current = ssoFlow
  }, [ssoFlow])

  useEffect(() => {
    isRecommendedSettingsRef.current = isRecommendedSettings
  }, [isRecommendedSettings])

  const fetchUserInfoSuccess = (isMultiAccount: boolean) => {
    if (isMultiAccount) return

    if (ssoFlowRef.current === 'signIn') {
      closeInfinityNotification()
      return
    }

    if (ssoFlowRef.current === 'import') {
      dispatch(fetchSubscriptionsRedisCloud(
        null,
        () => {
          closeInfinityNotification()
          history.push(Pages.redisCloudSubscriptions)
        },
        closeInfinityNotification,
      ))
      return
    }

    if (isRecommendedSettingsRef.current) {
      dispatch(createFreeDbJob({
        name: CloudJobName.CreateFreeSubscriptionAndDatabase,
        resources: {
          isRecommendedSettings: isRecommendedSettingsRef.current
        },
        onSuccessAction: () => {
          dispatch(addInfiniteNotification(INFINITE_MESSAGES.PENDING_CREATE_DB(CloudJobStep.Credentials)))
        },
        onFailAction: closeInfinityNotification
      }))

      return
    }

    dispatch(fetchPlans())
  }

  const closeInfinityNotification = () => {
    dispatch(removeInfiniteNotification(InfiniteMessagesIds.oAuthProgress))
  }

  const cloudOauthCallback = (_e: any, { status, message = '', error }: CloudAuthResponse) => {
    if (status === CloudAuthStatus.Succeed) {
      dispatch(setJob({ id: '', name: CloudJobName.CreateFreeSubscriptionAndDatabase, status: '' }))
      localStorageService.remove(BrowserStorageItem.OAuthJobId)
      dispatch(showOAuthProgress(true))
      dispatch(addInfiniteNotification(INFINITE_MESSAGES.PENDING_CREATE_DB(CloudJobStep.Credentials)))
      dispatch(setSignInDialogState(null))
      dispatch(setSocialDialogState(null))
      dispatch(fetchUserInfo(fetchUserInfoSuccess, closeInfinityNotification))
    }

    if (status === CloudAuthStatus.Failed) {
      const err = parseCloudOAuthError((error as CustomError) || message || '')
      dispatch(setOAuthCloudSource(null))
      dispatch(signInFailure(err?.response?.data?.message || message))
      dispatch(addErrorNotification(err))
      dispatch(setSSOFlow(''))
    }
  }

  return null
}

export default ConfigOAuth
