import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD,
});

const publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT;
const publicClient = publicEndpoint ? new Client({
  endPoint: publicEndpoint,
  port: Number(process.env.MINIO_PUBLIC_PORT) || 443,
  useSSL: process.env.MINIO_PUBLIC_SSL !== 'false',
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD,
}) : minioClient;

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'silapor';
export { publicClient };
export default minioClient;