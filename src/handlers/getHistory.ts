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
    const history = await prisma.histories.findFirst({
      where: {
        mangaId: id,
      },
    });
    if (history == null) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          chapter: null,
          page: null,
        }),
      };
    }
    const page = await prisma.pages.findUniqueOrThrow({
      where: {id: history.pageId},
    });
    const chapter = await prisma.chapters.findFirstOrThrow({
      where: {id: page.chapterId},
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        chapter,
        page,
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
