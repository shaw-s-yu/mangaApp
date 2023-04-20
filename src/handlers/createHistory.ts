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
    const {id, chapterId} = event.pathParameters ?? {};
    const chapter = await prisma.chapters.findUniqueOrThrow(
      {where: {id: chapterId}},
    );
    let history = await prisma.histories.findFirst({
      where: {
        mangaId: chapter.mangaId,
      },
    });
    if (history == null) {
      history = await prisma.histories.create({
        data: {
          mangaId: chapter.mangaId,
          pageId: id,
        },
      });
    } else {
      history = await prisma.histories.update({
        where: {
          mangaId: chapter.mangaId,
        },
        data: {
          pageId: id,
        },
      });
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        history,
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
