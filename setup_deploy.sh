#!/bin/bash

# ======================================================================
# Quick Deploy Setup Script for GitHub Pages
# ======================================================================

echo "🚀 Setting up GitHub Pages deployment..."

# Ensure we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Please run 'git init' first."
    exit 1
fi

echo "📦 Installing necessary gh-pages package..."
npm install --save-dev gh-pages

echo "🛠️ Adding deploy scripts to package.json..."
# This is a simple node script to add the deploy command if it doesn't exist
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
if (!pkg.scripts.predeploy) pkg.scripts.predeploy = 'npm run build';
if (!pkg.scripts.deploy) pkg.scripts.deploy = 'gh-pages -d dist';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

echo "✅ Setup complete!"
echo "------------------------------------------------------"
echo "To deploy your site manually, you can now run:"
echo "👉 npm run deploy"
echo "------------------------------------------------------"
echo "Note: If deploying to a project repository (e.g. username.github.io/my-repo), "
echo "you may need to set base: '/my-repo/' in your vite.config.ts"
echo "We have also included a .github/workflows/deploy.yml for automated Action deployment!"
