import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.resumeText || !body.jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required." },
        { status: 400 }
      );
    }

    const command = new InvokeCommand({
      FunctionName: process.env.ANALYZE_LAMBDA_NAME,
      Payload: Buffer.from(JSON.stringify(body)),
    });

    const response = await lambdaClient.send(command);

    const responsePayload = response.Payload
      ? JSON.parse(Buffer.from(response.Payload).toString())
      : null;

    if (!responsePayload || responsePayload.statusCode !== 200) {
      return Response.json(
        { error: "Lambda failed to analyze the job match." },
        { status: 500 }
      );
    }

    const parsedBody = JSON.parse(responsePayload.body);

    return Response.json(parsedBody);
  } catch (error) {
    console.error("Failed to invoke Lambda", error);

    return Response.json(
      { error: "Something went wrong while analyzing the job match." },
      { status: 500 }
    );
  }
}