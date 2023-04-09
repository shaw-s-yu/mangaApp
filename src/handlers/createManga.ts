import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as parser from 'lambda-multipart-parser'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const res = await parser.parse(event)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: res,
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
