#!/bin/bash
# Simple deployment script for local testing

echo "🚀 Starting AI Typing Assistant demo..."
echo "🌐 Running on: http://localhost:8000"
echo "🎯 Open your browser to view the demo"

# Create log file for any issues
echo "$(date) - AI Typing Assistant started" >> typing-assistant.log

# Start local server
python3 -m http.server 8000