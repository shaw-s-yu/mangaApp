import React, { useContext } from 'react'

export type ApiFetcherContextValue = {
  loading: boolean
  setLoading: (isLoading: boolean) => void
}

const _default: ApiFetcherContextValue = {
  loading: false,
  setLoading: () => {},
}

export const ApiFetcherContext =
  React.createContext<ApiFetcherContextValue>(_default)

export const useApiFetcherContext =
  (): ApiFetcherContextValue =>
    useContext<ApiFetcherContextValue>(ApiFetcherContext)
