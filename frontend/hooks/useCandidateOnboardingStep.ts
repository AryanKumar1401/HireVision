import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/auth';

export function useCandidateOnboardingStep() {
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<'profile' | 'resume' | 'dashboard'>('profile');
    const [profile, setProfile] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            setLoading(false);
            return;
        }
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        setProfile(profileData);

        // All fields required: full_name, phone, experience, linkedin, email
        if (!profileData?.full_name || !profileData?.phone || !profileData?.experience || !profileData?.linkedin || !profileData?.email) {
            setStep('profile');
        } else {
            // Check for at least one resume in resumes table
            const { data: resumes, error: resumesError } = await supabase
                .from('resumes')
                .select('id')
                .eq('user_id', session.user.id);
            if (!resumes || resumes.length === 0) {
                setStep('resume');
            } else {
                setStep('dashboard');
            }
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    function redirectIfNeeded(currentPage: 'profile' | 'resume' | 'dashboard') {
        if (loading) return;
        if (step === 'profile' && currentPage !== 'profile') {
            router.replace('/candidates/onboarding/profile');
        } else if (step === 'resume' && currentPage !== 'resume') {
            router.replace('/candidates/upload-resume');
        } else if (step === 'dashboard' && currentPage !== 'dashboard') {
            router.replace('/candidates/dashboard');
        }
    }

    // Expose a refresh function to re-fetch the profile and step
    return { loading, step, profile, redirectIfNeeded, refresh: fetchProfile };
} 