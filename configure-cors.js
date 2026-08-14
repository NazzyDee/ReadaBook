const readline = require('readline');
const https = require('https');

const CLIENT_ID = '563584335869-fgrhgmd47bqclth5j5hqp393t9e53q8n.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9Te1-TR12Bt16wFnD5W6laY';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const SCOPE = 'https://www.googleapis.com/auth/devstorage.full_control';
const BUCKET_NAME = 'readabook-b8675.firebasestorage.app';

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}&prompt=consent`;

console.log('\n======================================================');
console.log('Firebase Storage CORS Automated Configuration');
console.log('======================================================\n');
console.log('To configure CORS automatically, please follow these steps:');
console.log('1. Copy and open the following link in your web browser:');
console.log(`\n👉 ${authUrl}\n`);
console.log('2. Sign in with the Google Account that owns the Firebase project.');
console.log('3. Copy the authorization code shown on the screen.');
console.log('4. Paste the authorization code below and press Enter.');
console.log('======================================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste the authorization code here: ', (code) => {
  rl.close();
  if (!code || code.trim().length === 0) {
    console.error('Error: Authorization code cannot be empty.');
    process.exit(1);
  }

  exchangeCodeForToken(code.trim());
});

function exchangeCodeForToken(code) {
  console.log('\nExchanging authorization code for access token...');
  const postData = `code=${encodeURIComponent(code)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&grant_type=authorization_code`;

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
        console.error('\nOAuth Exchange Failed:', tokenRes.error_description || tokenRes.error);
        process.exit(1);
      }
      
      setBucketCors(tokenRes.access_token);
    });
  });

  req.on('error', (e) => {
    console.error('Network error during exchange:', e.message);
  });

  req.write(postData);
  req.end();
}

function setBucketCors(accessToken) {
  console.log(`Applying CORS configuration to bucket: gs://${BUCKET_NAME}...`);

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
        console.log('\n✅ SUCCESS: CORS has been successfully configured on your Firebase Storage bucket!');
        console.log('You can now upload your story videos from Netlify or localhost without any CORS issues!\n');
      } else {
        const err = JSON.parse(responseData);
        console.error(`\n❌ FAILED (Status ${res.statusCode}):`, err.error ? err.error.message : responseData);
      }
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error('Network error during patch:', e.message);
  });

  req.write(putData);
  req.end();
}
