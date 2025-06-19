import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/utils/auth';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: {
        id: string | null;
        email: string | null;
        roles: string[];
    } | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Extract roles from user metadata
            const roles = data.user?.user_metadata?.roles ||
                data.user?.app_metadata?.roles ||
                [];

            return {
                id: data.user?.id || null,
                email: data.user?.email || null,
                roles: roles
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthState['user']>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer; 