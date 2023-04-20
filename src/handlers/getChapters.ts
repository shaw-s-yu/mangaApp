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
    const chapters = await prisma.chapters.findMany({
      where: {mangaId: id},
      orderBy: {name: 'asc'},
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        chapters,
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
