import { useState, useEffect } from 'react';
import { createClient } from '@/utils/auth';
import { ProfileFormData } from '@/types/candidate';

const supabase = createClient();

export const useProfile = () => {
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
    };
    getSession();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) {
          setProfileData(profile);
          setShowProfileForm(false);
        }
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (formData: ProfileFormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      setProfileData(formData);
      setShowProfileForm(false);
    }
    return error;
  };

  const updateVideoUrl = async (filename: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    return await supabase
      .from('profiles')
      .update({
        video_url: filename,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
  };

  return {
    showProfileForm,
    profileData,
    userEmail,
    updateProfile,
    updateVideoUrl
  };
};
