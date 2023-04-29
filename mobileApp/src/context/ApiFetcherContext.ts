import React, { useContext } from 'react'

export type TLoadingMap = {
  [key: string]: boolean
}

export type ApiFetcherContextValue = {
  loadingMap: TLoadingMap
  setLoadingMap: (loadingMap: TLoadingMap) => void
}

const _default: ApiFetcherContextValue = {
  loadingMap: {},
  setLoadingMap: () => {},
}

export const ApiFetcherContext =
  React.createContext<ApiFetcherContextValue>(_default)

export const useApiFetcherContext =
  (): ApiFetcherContextValue =>
    useContext<ApiFetcherContextValue>(ApiFetcherContext)
