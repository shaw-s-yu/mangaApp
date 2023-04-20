import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const {id} = event.pathParameters ?? {};
    const currentPage =
      await prisma.pages.findUniqueOrThrow({
        where: {id},
      });
    const nextPage = await prisma.pages.findFirst({
      where: {
        AND: [
          {chapterId: currentPage.chapterId},
          {index: {gt: currentPage.index}},
        ],
      },
      orderBy: {index: 'asc'},
    });
    if (nextPage != null) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          page: nextPage,
        }),
      };
    }
    const currentChapter =
      await prisma.chapters.findUniqueOrThrow({
        where: {
          id: currentPage.chapterId,
        },
      });
    const nextChapter = await prisma.chapters.findFirst({
      where: {
        AND: [
          {name: {gt: currentChapter.name}},
          {mangaId: currentChapter.mangaId},
        ],
      },
      orderBy: {name: 'asc'},
    });
    if (nextChapter == null) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          page: null,
        }),
      };
    }
    const firstPage = await prisma.pages.findFirst({
      where: {chapterId: nextChapter.id},
      orderBy: {index: 'asc'},
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        page: firstPage,
      }),
    };
  } catch (err: unknown) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          err instanceof Error
            ? err.message
            : 'some error happened',
      }),
    };
  }
}
