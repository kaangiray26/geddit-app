#!/usr/bin/zsh
set -e

# Build
vite build

# Capacitor sync
printf "\nSyncing to Android...\n"
npx cap sync

# Minify the geddit.js
printf "\nAdding files to docs...\n"
./node_modules/.bin/terser ./src/js/geddit.js --compress --output=./docs/geddit.min.js

# Copy README to docs
cp README.md ./docs/

# Copy geddit.js to docs
cp ./src/js/geddit.js ./docs/

# Push to git
printf "\nPushing to git...\n"
git add -A
git commit -m "deploy via script"
git push