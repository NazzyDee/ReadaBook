const fs = require('fs');
const path = require('path');
const https = require('https');

const BUCKET_NAME = 'readabook-b8675.firebasestorage.app';
const configPath = path.join(process.env.USERPROFILE || 'C:\\Users\\npwhi', '.config', 'configstore', 'firebase-tools.json');

console.log('\n======================================================');
console.log('Firebase Storage CORS Automated Configuration (via Firebase CLI)');
console.log('======================================================\n');

if (!fs.existsSync(configPath)) {
  console.error(`❌ ERROR: Firebase credentials file not found at: ${configPath}`);
  console.error('Please run "npx firebase login" in your terminal first to log in!\n');
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error('❌ ERROR: Failed to parse firebase-tools.json:', e.message);
  process.exit(1);
}

const refreshToken = config.tokens && config.tokens.refresh_token;
if (!refreshToken) {
  console.error('❌ ERROR: No refresh token found in firebase-tools.json.');
  console.error('Please run "npx firebase login" again to refresh your session.\n');
  process.exit(1);
}

console.log('Found active Firebase login session for:', config.user ? config.user.email : 'Unknown User');
exchangeRefreshToken(refreshToken);

function exchangeRefreshToken(refreshToken) {
  console.log('Obtaining access token from Google OAuth...');
  
  // Public Firebase CLI credentials for OAuth token exchange
  const clientId = '563584335869-fgrhgmd47bqclth5j5hqp393t9e53q8n.apps.googleusercontent.com';
  const clientSecret = 'j9Te1-TR12Bt16wFnD5W6laY';
  
  const postData = `grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${encodeURIComponent(refreshToken)}`;

  const req = https.request({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  }, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      const tokenRes = JSON.parse(responseData);
      if (tokenRes.error) {
        console.error('❌ OAuth Token Exchange Failed:', tokenRes.error_description || tokenRes.error);
        process.exit(1);
      }
      
      applyCors(tokenRes.access_token);
    });
  });

  req.on('error', (e) => {
    console.error('❌ Network error during token exchange:', e.message);
  });

  req.write(postData);
  req.end();
}

function applyCors(accessToken) {
  console.log(`Setting CORS on storage bucket gs://${BUCKET_NAME}...`);

  const corsConfig = [
    {
      origin: ['*'],
      method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
      responseHeader: ['Content-Type', 'x-goog-meta-*', 'Authorization', 'Content-Length', 'User-Agent', 'x-requested-with'],
      maxAgeSeconds: 3600
    }
  ];

  const putData = JSON.stringify({
    cors: corsConfig
  });

  const req = https.request({
    hostname: 'storage.googleapis.com',
    path: `/storage/v1/b/${BUCKET_NAME}?fields=cors`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': putData.length
    }
  }, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('\n======================================================');
        console.log('✅ SUCCESS: CORS successfully configured on your Firebase Storage bucket!');
        console.log('You can now upload your story videos without any CORS issues.');
        console.log('======================================================\n');
      } else {
        const err = JSON.parse(responseData);
        console.error(`\n❌ FAILED (Status ${res.statusCode}):`, err.error ? err.error.message : responseData);
      }
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error('❌ Network error during patch request:', e.message);
  });

  req.write(putData);
  req.end();
}
