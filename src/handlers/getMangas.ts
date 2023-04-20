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
    if (id != null) {
      const mangas = await prisma.mangas.findUnique({
        where: {id},
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          mangas,
        }),
      };
    } else {
      const mangas = await prisma.mangas.findMany();
      return {
        statusCode: 200,
        body: JSON.stringify({
          mangas,
        }),
      };
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
    };
  }
}
