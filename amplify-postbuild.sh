#!/bin/bash
# Post-build script for Amplify deployment

# Copy assets to the distribution folder if needed
if [ -d "client/src/assets" ]; then
  mkdir -p dist/public/assets
  cp -R client/src/assets/* dist/public/assets/
fi

# Additional post-build tasks can be added here
echo "Post-build script completed successfully"