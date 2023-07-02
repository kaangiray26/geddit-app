#!/usr/bin/zsh
set -e

# Build
vite build

# Capacitor sync
printf "\nSyncing to Android...\n"
npx cap sync

# Push to git
printf "\nPushing to git...\n"
git add -A
git commit -m "deploy via script"
git push