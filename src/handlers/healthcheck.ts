import { APIGatewayProxyResult } from 'aws-lambda'

export async function handler(): Promise<APIGatewayProxyResult> {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'OK',
      }),
    }
  } catch (err: unknown) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'some error happened',
      }),
    }
  }
}
