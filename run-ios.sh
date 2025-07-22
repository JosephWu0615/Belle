#!/bin/bash

echo "🚀 Starting Belle App..."

# Check if Metro is running
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Metro bundler is already running"
else
    echo "📦 Starting Metro bundler..."
    npm start &
    sleep 5
fi

echo "📱 Building and launching iOS app..."
npm run ios

echo "✨ Belle App is running!"