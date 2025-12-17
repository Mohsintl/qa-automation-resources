#!/usr/bin/env node

/**
 * Setup script for QA Backend migration from Deno to Node.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up QA Backend (Node.js/Express)...\n');

// Check if we're in the backend directory
if (!fs.existsSync('package.json') || !fs.existsSync('src')) {
  console.error('❌ Please run this script from the backend directory');
  process.exit(1);
}

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created. Please edit it with your actual values.\n');
  } else {
    console.log('⚠️  .env.example not found. Please create .env manually.\n');
  }
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies already installed');
}

// Check storage directory
if (!fs.existsSync('storage')) {
  fs.mkdirSync('storage');
  console.log('📁 Created storage directory for KV store');
}

console.log('🎯 Next steps:');
console.log('1. Edit .env with your Supabase credentials');
console.log('2. Run: npm run dev (development)');
console.log('3. Test API: curl http://localhost:3001/health');
console.log('4. Update frontend VITE_API_BASE_URL to http://localhost:3001/api\n');

console.log('📚 Available commands:');
console.log('• npm run dev     - Start development server');
console.log('• npm run build   - Build for production');
console.log('• npm start       - Start production server');
console.log('• npm test        - Run tests\n');

console.log('🔄 Migration complete! 🎉');