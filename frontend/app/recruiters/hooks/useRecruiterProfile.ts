import { useState, useEffect } from 'react';
import { createClient } from '@/utils/auth';
import { RecruiterProfile } from '../types';

const supabase = createClient();

export const useRecruiterProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [profileData, setProfileData] = useState<RecruiterProfile | null>(null);
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
            .from('recruiter_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile?.full_name) {

            setProfileData(profile);
            setShowProfileForm(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async (profileFormData: RecruiterProfile) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession(); // Use getSession()
      const user = session?.user;
      console.log('session user while updating form: ', user);      
      if (!user) throw new Error('No authenticated user');

      const profile = {
        id: user.id,
        email: user.email,
        ...profileFormData,
      };

      const { error } = await supabase
        .from('recruiter_profiles')
        .upsert(profile, { onConflict: 'id' });
        console.log('profileFormData:', profileFormData); // Log profileFormData
        console.log('profile:', profile); // Log the profile object
      if (error) throw error;

      setProfileData(profile);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, showProfileForm, profileData, userEmail, updateProfile };
};