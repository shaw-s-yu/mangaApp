import { APIGatewayProxyResult } from 'aws-lambda'
import { buildMangaCollection } from '../utils/fileHelper'

export async function handler(): Promise<APIGatewayProxyResult> {
  await buildMangaCollection('8c9a3919-89d5-4494-b56e-95ca5286dcdb', '/Users/shawyu/Downloads/manga/(一般コミック) [尾田栄一郎] ONE PIECE ワンピース 第01-78巻 Color Edition')
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
