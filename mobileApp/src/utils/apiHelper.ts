export const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
}

export type API_METHOD_TYPE = 'GET' | 'POST'
export const fetchApi = async (
  url: string,
  method: API_METHOD_TYPE,
  body?: any
): Promise<any> => {
  try {
    const response = await fetch(url, {
      body,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.json()
  } catch (error: unknown) {
    return {
      error,
    }
  }
}
