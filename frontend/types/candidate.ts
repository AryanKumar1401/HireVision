/**
 * Type definitions for candidate profiles
 */

export interface ProfileFormData {
  full_name: string;
  email: string;
  phone: string;
  experience: string;
  linkedin: string;
  updated_at?: string | null;
  video_url?: string;
}