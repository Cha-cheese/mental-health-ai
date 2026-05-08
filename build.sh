#!/bin/bash
# Build React and copy to backend folder

echo "Building React app..."
cd frontend-react
npm install
npm run build

echo "Copying build to backend..."
cp -r build ../backend/build

echo "Done! Ready to deploy."
