#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Run Gunicorn with Uvicorn worker
gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
