#!/bin/bash

# Build Electron main process
echo "Building Electron main process..."
tsc -p electron/tsconfig.json

# Build React app
echo "Building React application..."
npm run build:vite

echo "Build complete! Output in dist/"
