import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export class AmazonS3Service {
  private s3Client: S3Client;
  constructor() {
    try {
      const AWS_REGION = process.env.AWS_REGION;
      const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
      const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
      if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        throw new Error("AWS S3 environment variables are not set");
      }
      this.s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async uploadToS3(objectCommand: PutObjectCommandInput) {
    return new Upload({
      client: this.s3Client,
      params: objectCommand,
    }).done();
  }

  downloadFromS3(objectCommand: GetObjectCommandInput) {
    const s3Command = new GetObjectCommand(objectCommand);
    return this.s3Client.send(s3Command);
  }
}
