import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'silapor';
export default minioClient;