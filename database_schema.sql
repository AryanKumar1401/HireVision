-- Database schema for HireVision interview system

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview questions table
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview invites table
CREATE TABLE IF NOT EXISTS interview_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    invite_code VARCHAR(6) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Interview participants table
CREATE TABLE IF NOT EXISTS interview_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(interview_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interviews_recruiter_id ON interviews(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_interviews_company_number ON interviews(company_number);
CREATE INDEX IF NOT EXISTS idx_interview_questions_interview_id ON interview_questions(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_order ON interview_questions(interview_id, order_index);
CREATE INDEX IF NOT EXISTS idx_interview_invites_code ON interview_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_interview_invites_email ON interview_invites(email);
CREATE INDEX IF NOT EXISTS idx_interview_invites_interview_id ON interview_invites(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_participants_user_id ON interview_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_participants_interview_id ON interview_participants(interview_id);

-- Enable Row Level Security (RLS)
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interviews table
CREATE POLICY "Recruiters can view their own interviews" ON interviews
    FOR SELECT USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can insert their own interviews" ON interviews
    FOR INSERT WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update their own interviews" ON interviews
    FOR UPDATE USING (auth.uid() = recruiter_id);

-- RLS Policies for interview_questions table
CREATE POLICY "Anyone can view interview questions" ON interview_questions
    FOR SELECT USING (true);

CREATE POLICY "Recruiters can insert questions for their interviews" ON interview_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM interviews 
            WHERE id = interview_id AND recruiter_id = auth.uid()
        )
    );

CREATE POLICY "Recruiters can update questions for their interviews" ON interview_questions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM interviews 
            WHERE id = interview_id AND recruiter_id = auth.uid()
        )
    );

-- RLS Policies for interview_invites table
CREATE POLICY "Recruiters can view invites for their interviews" ON interview_invites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM interviews 
            WHERE id = interview_id AND recruiter_id = auth.uid()
        )
    );

CREATE POLICY "Recruiters can insert invites for their interviews" ON interview_invites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM interviews 
            WHERE id = interview_id AND recruiter_id = auth.uid()
        )
    );

CREATE POLICY "Recruiters can update invites for their interviews" ON interview_invites
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM interviews 
            WHERE id = interview_id AND recruiter_id = auth.uid()
        )
    );

-- RLS Policies for interview_participants table
CREATE POLICY "Users can view their own participation" ON interview_participants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view participants for their interviews" ON interview_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM interviews 
            WHERE id = interview_id AND recruiter_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own participation" ON interview_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" ON interview_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_interviews_updated_at 
    BEFORE UPDATE ON interviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 