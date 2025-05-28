import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/utils/auth';

interface ProfileData {
    full_name: string;
    phone: string;
    experience: string;
    linkedin: string;
    email: string;
    updated_at?: string;
}

interface ProfileState {
    profileData: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    showProfileForm: boolean;
}

const initialState: ProfileState = {
    profileData: null,
    isLoading: true,
    error: null,
    showProfileForm: true,
};

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                throw new Error('No user session found');
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (formData: ProfileData, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('No user found');
            }

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...formData,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            return formData;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setShowProfileForm: (state, action: PayloadAction<boolean>) => {
            state.showProfileForm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileData = action.payload;
                state.showProfileForm = !action.payload?.full_name;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profileData = action.payload;
                state.showProfileForm = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setShowProfileForm } = profileSlice.actions;
export default profileSlice.reducer; 