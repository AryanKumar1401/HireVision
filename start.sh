#!/bin/bash

# Start backend
cd backend
source venv/bin/activate  # Or source pytorch_env/bin/activate if using that environment
python main.py &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to kill processes on exit
cleanup() {
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Set up trap to catch termination signal
trap cleanup INT

# Wait for user to press Ctrl+C
wait