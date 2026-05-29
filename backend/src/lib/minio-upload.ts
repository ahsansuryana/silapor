import minioClient, { BUCKET_NAME } from './minio';
import { randomUUID } from 'crypto';

export const uploadToMinIO = async (file: Buffer, originalName: string): Promise<string> => {
  const ext = originalName.split('.').pop() || 'jpg';
  const objectKey = `reports/${randomUUID()}.${ext}`;
  
  await minioClient.putObject(BUCKET_NAME, objectKey, file);
  
  return objectKey;
};

export const deleteFromMinIO = async (objectKey: string): Promise<void> => {
  await minioClient.removeObject(BUCKET_NAME, objectKey);
};

export const getPresignedUrl = async (objectKey: string, expires = 3600): Promise<string> => {
  return minioClient.presignedGetObject(BUCKET_NAME, objectKey, expires);
};