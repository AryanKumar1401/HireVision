import { useState } from 'react';
import { createClient } from '@/utils/auth';

const supabase = createClient();

export const useSupabaseUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getSignedUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("videos")
        .createSignedUrl(filePath, 36000);

      if (error) {
        console.error("Error getting signed URL:", error);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.error("Error in getSignedUrl:", err);
      return null;
    }
  };

  const uploadVideo = async (videoBlob: Blob) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      setIsUploading(true);
      setUploadProgress(0);

      const filename = `${userId}_${Date.now()}.mp4`;
      const videoFile = new File([videoBlob], filename, { type: "video/webm" });

      const { data, error } = await supabase.storage
        .from("videos")
        .upload(filename, videoFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(filename);

      setUploadProgress(100);

      const signedUrl = await getSignedUrl(filename);
      return { publicUrl, signedUrl, filename };

    } catch (error) {
      console.error("Error uploading to Supabase:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadVideo,
    getSignedUrl
  };
};
