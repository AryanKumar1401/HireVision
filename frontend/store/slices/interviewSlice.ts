import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InterviewState {
    currentQuestionIndex: number;
    recordedAnswers: Record<number, Blob>;
    isRecording: boolean;
    isInterviewFinished: boolean;
    processingStatus: string;
    isAnalysisComplete: boolean;
    questions: string[];
    isQuestionsLoading: boolean;
}

const initialState: InterviewState = {
    currentQuestionIndex: 0,
    recordedAnswers: {},
    isRecording: false,
    isInterviewFinished: false,
    processingStatus: '',
    isAnalysisComplete: false,
    questions: [],
    isQuestionsLoading: true,
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        addRecordedAnswer: (state, action: PayloadAction<{ index: number; blob: Blob }>) => {
            state.recordedAnswers[action.payload.index] = action.payload.blob;
        },
        setIsRecording: (state, action: PayloadAction<boolean>) => {
            state.isRecording = action.payload;
        },
        setIsInterviewFinished: (state, action: PayloadAction<boolean>) => {
            state.isInterviewFinished = action.payload;
        },
        setProcessingStatus: (state, action: PayloadAction<string>) => {
            state.processingStatus = action.payload;
        },
        setIsAnalysisComplete: (state, action: PayloadAction<boolean>) => {
            state.isAnalysisComplete = action.payload;
        },
        setQuestions: (state, action: PayloadAction<string[]>) => {
            state.questions = action.payload;
            state.isQuestionsLoading = false;
        },
        setQuestionsLoading: (state, action: PayloadAction<boolean>) => {
            state.isQuestionsLoading = action.payload;
        },
        resetInterview: (state) => {
            return initialState;
        },
    },
});

export const {
    setCurrentQuestionIndex,
    addRecordedAnswer,
    setIsRecording,
    setIsInterviewFinished,
    setProcessingStatus,
    setIsAnalysisComplete,
    setQuestions,
    setQuestionsLoading,
    resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer; 