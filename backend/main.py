# # backend/main.py
# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import boto3
# import os
# from datetime import datetime
# import uuid
# from botocore.exceptions import ClientError
# import logging
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Initialize FastAPI app
# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize AWS S3 client
# s3_client = boto3.client(
#     's3',
#     aws_access_key_id=os.getenv('ACCESS_KEY_ID'),
#     aws_secret_access_key=os.getenv('SECRET_ACCESS_KEY'),
#     region_name=os.getenv('us-east-1')
# )

# class UploadResponse(BaseModel):
#     url: str
#     key: str

# @app.post("/video/presigned-url")
# async def get_presigned_url():
#     try:
#         # Generate unique file name
#         file_key = f"videos/{datetime.now().strftime('%Y%m%d')}/{uuid.uuid4()}.webm"
        
#         # Generate presigned URL
#         presigned_url = s3_client.generate_presigned_url(
#             'put_object',
#             Params={
#                 'Bucket': os.getenv('talent_hackathon'),
#                 'Key': file_key,
#                 'ContentType': 'video/webm'
#             },
#             ExpiresIn=3600  # URL expires in 1 hour
#         )
        
#         return UploadResponse(url=presigned_url, key=file_key)
#     except ClientError as e:
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)