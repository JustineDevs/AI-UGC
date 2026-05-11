export interface StorageEnvironment {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  s3Bucket: string;
}

export const loadStorageEnvironment = (): StorageEnvironment => ({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bucket: process.env.AWS_S3_BUCKET || '',
  s3Bucket: process.env.AWS_S3_BUCKET || '',
});
