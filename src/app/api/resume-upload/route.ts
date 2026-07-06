import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const oldResumeFileKey = formData.get("oldResumeFileKey");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Resume file is required." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF resumes are supported." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extractedResumeText = await extractTextFromPdf(buffer);

    if (!extractedResumeText) {
      return Response.json(
        { error: "Could not extract text from this PDF." },
        { status: 400 }
      );
    }

    const fileKey = `resumes/${crypto.randomUUID()}-${file.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_RESUME_BUCKET!,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      })
    );

    if (typeof oldResumeFileKey === "string" && oldResumeFileKey) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_RESUME_BUCKET!,
          Key: oldResumeFileKey,
        })
      );
    }

    return Response.json({
      resumeFileKey: fileKey,
      resumeFileName: file.name,
      resumeText: extractedResumeText,
    });
  } catch (error) {
    console.error("Resume upload failed", error);

    return Response.json(
      { error: "Something went wrong while uploading the resume." },
      { status: 500 }
    );
  }
}

function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (error) => {
      reject(error);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const text = pdfData.Pages.flatMap((page: any) =>
        page.Texts.map((textItem: any) =>
          textItem.R.map((run: any) => safeDecode(run.T)).join("")
        )
      ).join(" ");

      resolve(text.trim());
    });

    pdfParser.parseBuffer(buffer);
  });
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}