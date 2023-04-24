import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const { id } = event.pathParameters ?? {}
    const currentPage =
      await prisma.pages.findUniqueOrThrow({
        where: { id },
      })
    const prevPage = await prisma.pages.findFirst({
      where: {
        AND: [
          { chapterId: currentPage.chapterId },
          { index: { lt: currentPage.index } },
        ],
      },
      orderBy: { index: 'desc' },
    })
    if (prevPage != null) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          page: prevPage,
        }),
      }
    }
    const currentChapter =
      await prisma.chapters.findUniqueOrThrow({
        where: {
          id: currentPage.chapterId,
        },
      })
    const prevChapter = await prisma.chapters.findFirst({
      where: {
        AND: [
          { name: { lt: currentChapter.name } },
          { mangaId: currentChapter.mangaId },
        ],
      },
      orderBy: { name: 'desc' },
    })
    if (prevChapter == null) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          page: null,
        }),
      }
    }
    const lastPage = await prisma.pages.findFirst({
      where: { chapterId: prevChapter.id },
      orderBy: { index: 'desc' },
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        page: lastPage,
      }),
    }
  } catch (err: unknown) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          err instanceof Error
            ? err.message
            : 'some error happened',
      }),
    }
  }
}
