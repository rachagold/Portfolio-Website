const fs = require('fs');
const path = require('path');
const { put, list } = require('@vercel/blob');

// Parse .env and .env.local to find BLOB_READ_WRITE_TOKEN
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../.env.local')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*BLOB_READ_WRITE_TOKEN\s*=\s*["']?(vercel_blob_rw_[a-zA-Z0-9_]+)["']?/);
        if (match) {
          process.env.BLOB_READ_WRITE_TOKEN = match[1];
          console.log('Successfully loaded BLOB_READ_WRITE_TOKEN from', path.basename(envPath));
          return;
        }
      }
    }
  }
}

async function run() {
  loadEnv();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN not found in .env or .env.local.');
    return;
  }

  const BLOB_FILENAME = 'sold-originals.json';
  let soldList = [];

  try {
    console.log('Listing blobs to find', BLOB_FILENAME);
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    if (blobs.length > 0) {
      const blob = blobs[0];
      console.log('Found existing blob at URL:', blob.url);
      const res = await fetch(blob.url);
      if (res.ok) {
        soldList = await res.json();
      }
    }
  } catch (err) {
    console.log('No existing blob found or failed to fetch, initializing new list.');
  }

  const target = 'Battambang EP';
  if (!soldList.includes(target)) {
    soldList.push(target);
    console.log(`Adding "${target}" to sold list.`);
  } else {
    console.log(`"${target}" is already in the sold list.`);
  }

  console.log('Current sold list:', soldList);

  const updatedContent = JSON.stringify(soldList);
  const result = await put(BLOB_FILENAME, updatedContent, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });

  console.log('Successfully updated blob. Result URL:', result.url);
}

run().catch(console.error);
