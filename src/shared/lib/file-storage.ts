import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import cuid from "cuid";

import * as mime from "mime-types";
import { privateConfig } from "./config/private";

export type StoredFile = {
  id: string;
  name: string;
  path: string;
  prefix: string;
  type: string;
  eTag?: string;
};

class FileStorage {
  s3Client = new S3Client({
    forcePathStyle: true,
    endpoint: privateConfig.S3_ENDPOINT,
    region: privateConfig.S3_REGION,
    credentials: {
      accessKeyId: privateConfig.S3_ACCESS_KEY_ID,
      secretAccessKey: privateConfig.S3_SECRET_ACCESS_KEY,
    },
  });

  async uploadImage(
    file: File,
    tag: string,
    fileName?: string,
  ) {
    return this.upload(
      file,
      privateConfig.S3_IMAGES_BUCKET,
      tag,
      fileName,
    );
  }

  async upload(
    file: File,
    bucket: string,
    tag: string,
    fileName?: string,
  ): Promise<StoredFile> {
    // Создаем полный путь (если папка указана)
    console.log(privateConfig.S3_ACCESS_KEY_ID);
    console.log(privateConfig.S3_SECRET_ACCESS_KEY);

    const folderPrefix = `${tag}/`;
    const fileKey =
      fileName === undefined
        ? `${folderPrefix}${tag}-${Date.now().toString()}-${file.name}`
        : `${folderPrefix}${tag}-${fileName}`;

    const res = await new Upload({
      client: this.s3Client,
      params: {
        ACL: "public-read",
        Bucket: bucket,
        Key: fileKey, // Ключ файла с учетом пути к папке
        Body: file,
        ContentType: mime.lookup(file.name) || undefined,
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    }).done();

    return {
      id: cuid(),
      name: file.name,
      type: file.type,
      path: `/storage/${bucket}/${res.Key}`, // Путь будет включать папку
      prefix: "/storage",
      eTag: res.ETag,
    };
  }
}

export const fileStorage = new FileStorage();
