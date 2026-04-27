#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# LawBot Backend — Start Script
# ─────────────────────────────────────────────────────────────────

echo "============================================"
echo "  LawBot Backend - FastAPI"
echo "============================================"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found. Install Python 3.10+"
    exit 1
fi

# Install dependencies if not present
echo "Checking dependencies..."
pip install -r requirements.txt --break-system-packages -q

# Copy env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo ""
    echo "⚠️  Created .env file. Please add your GROQ_API_KEY for best results."
    echo "   Get free key at: https://console.groq.com"
    echo ""
fi

# Start server
echo "Starting FastAPI server on http://localhost:8000"
echo "API Docs available at: http://localhost:8000/docs"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
