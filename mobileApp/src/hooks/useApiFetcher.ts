import { useCallback, useEffect, useState } from 'react'
import { useApiFetcherContext } from '../context/ApiFetcherContext'
import {
  API_METHOD_TYPE,
  fetchApi,
} from '../utils/apiHelper'

export default (): any => {
  const { setLoading } = useApiFetcherContext()
  const handlerApiFetcher = useCallback(
    async (
      url: string,
      method: API_METHOD_TYPE,
      body?: any
    ) => {
      console.log(url)
      setLoading(true)
      const response = await fetchApi(url, method, body)
      setLoading(false)
      return response
    },
    [setLoading, fetchApi]
  )

  return handlerApiFetcher
}
