// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// import { S3 } from 'aws-sdk';
// import { NextApiRequest, NextApiResponse } from 'next';
// export interface UploadResponse {
//   url: string;
//   key: string;
// }

// const s3 = ({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   signatureVersion: 'v4',
// });

// export async function getPresignedUrl(): Promise<UploadResponse> {
//   const response = await fetch(`${API_BASE_URL}/video/presigned-url`, {
//     method: 'POST',
//   });

//   if (!response.ok) {
//     throw new Error('Failed to get upload URL');
//   }

//   return response.json();
// }

// export async function uploadToS3(url: string, videoBlob: Blob): Promise<void> {
//   const response = await fetch(url, {
//     method: 'PUT',
//     body: videoBlob,
//     headers: {
//       'Content-Type': 'video/webm',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to upload to S3');
//   }
// }