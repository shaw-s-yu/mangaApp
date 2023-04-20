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
    return {
      statusCode: 200,
      body: JSON.stringify({
        page: currentPage,
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
