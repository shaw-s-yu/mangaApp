import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as parser from 'lambda-multipart-parser'
import * as fs from 'fs'
import { v4 } from 'uuid'
import { PrismaClient } from '@prisma/client'
import { buildMangaCollection } from '../utils/fileHelper'
const prisma = new PrismaClient()

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const { mangaName, mangaDescription, path, files } = await parser.parse(event)
    const previewImagePath = `./data/${v4()}.${files[0].filename.split('.').pop()}`
    await fs.writeFileSync(previewImagePath, files[0].content)

    const { id } = await prisma.mangas.create({
      data: {
        name: mangaName,
        description: mangaDescription,
        previewImagePath
      }
    })

    const message = await buildMangaCollection(id, path)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
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
