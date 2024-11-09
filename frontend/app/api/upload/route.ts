import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: 'us-east-1',
});

export async function POST(request: Request) {
    try {
      // Parse the JSON body
      const { fileName, fileType } = await request.json();
  
      const s3Params = {
        Bucket: 'talent_hackathon',
        Key: `videos/${fileName}`,
        ContentType: fileType,
        ACL: 'public-read' as ObjectCannedACL,
      };
  
      // Create a command to put an object in S3
      const command = new PutObjectCommand(s3Params);
  
      // Generate the signed URL
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
      return NextResponse.json({
        signedUrl,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${fileName}`,
      });
  
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return NextResponse.json(
        { error: 'Failed to generate signed URL' },
        { status: 500 }
      );
    }
  }