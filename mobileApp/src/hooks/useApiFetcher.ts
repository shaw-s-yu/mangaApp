import { useCallback, useEffect, useState } from 'react'
import { useApiFetcherContext } from '../context/ApiFetcherContext'
import {
  API_METHOD_TYPE,
  fetchApi,
} from '../utils/apiHelper'

export default (): any => {
  let { loadingMap, setLoadingMap } = useApiFetcherContext()
  const handlerApiFetcher = useCallback(
    async (
      url: string,
      method: API_METHOD_TYPE,
      keys: Array<string> = [],
      body?: any
    ) => {
      for (let key of keys) {
        loadingMap[key] = true
      }
      setLoadingMap({ ...loadingMap })
      const response = await fetchApi(url, method, body)
      for (let key of keys) {
        loadingMap[key] = false
      }
      setTimeout(() => {
        setLoadingMap({ ...loadingMap })
      }, 500)
      return response
    },
    [setLoadingMap, fetchApi]
  )

  return handlerApiFetcher
}
