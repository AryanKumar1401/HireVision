import { useState, useEffect } from 'react';
import { createClient } from '@/utils/auth';
import { ProfileFormData } from '@/types/candidate';

const supabase = createClient();

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get session info
        const { data: { session } } = await supabase.auth.getSession();
        setUserEmail(session?.user?.email ?? null);
        
        // Check profile if user is authenticated
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile?.full_name) {
            setProfileData(profile);
            setShowProfileForm(false);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        // Set loading to false regardless of success or failure
        setIsLoading(false);
      }
    };

    fetchUserData();
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
    isLoading,
    showProfileForm,
    profileData,
    userEmail,
    updateProfile,
    updateVideoUrl
  };
};
