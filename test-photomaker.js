// test-photomaker.js — Using the EXACT working approach from Runware Playground
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiKey = process.env.RUNWARE_API_KEY;
const imagePath = join(__dirname, 'static', 'test-images', 'reference.jpg');

async function apiCall(body) {
  const response = await fetch('https://api.runware.ai/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

async function runTest() {
  // Step 1: Upload reference image
  console.log('=== STEP 1: Upload reference image ===');
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  console.log('Image file size:', (imageBuffer.length / 1024).toFixed(1), 'KB');

  const uploadResult = await apiCall([{
    taskType: 'imageUpload',
    taskUUID: randomUUID(),
    image: base64Image
  }]);

  const uploadData = Array.isArray(uploadResult.data) ? uploadResult.data[0] : uploadResult.data;
  const imageURL = uploadData.imageURL;
  console.log('Uploaded image URL:', imageURL);

  // Step 2: Generate with EXACT playground approach
  console.log('\n=== STEP 2: Generate (Playground approach) ===');
  const taskUUID = randomUUID();

  const requestBody = [{
    taskType: 'imageInference',
    taskUUID,
    model: 'runware:400@1',
    positivePrompt: 'make this person be giving a speech to the United Nations Assembly wearing a dark blue suit and striped blue and white tie, tied beautifully. Add a white pocket handkerchief to the jacket pocket',
    height: 1024,
    width: 1024,
    numberResults: 1,
    outputType: ['URL'],
    CFGScale: 3.5,
    scheduler: 'FlowMatchEulerDiscreteScheduler',
    includeCost: true,
    inputs: {
      referenceImages: [imageURL]
    },
    acceleration: 'high',
    deliveryMethod: 'async'
  }];

  console.log('Request:', JSON.stringify(requestBody, null, 2));
  console.log('\nSending...');

  const submitResult = await apiCall(requestBody);
  console.log('Submit response:', JSON.stringify(submitResult, null, 2));

  // Step 3: Poll for result
  console.log('\n=== STEP 3: Polling for result ===');
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    process.stdout.write('.');

    const pollResult = await apiCall([{
      taskType: 'getResponse',
      taskUUID
    }]);

    if (pollResult?.data?.[0]?.imageURL) {
      console.log('\n\n--- RESULT ---');
      console.log('Image URL:', pollResult.data[0].imageURL);
      console.log('Cost:', pollResult.data[0].cost);
      console.log('Seed:', pollResult.data[0].seed);
      return;
    }

    if (pollResult?.errors) {
      console.log('\nError:', JSON.stringify(pollResult.errors, null, 2));
      return;
    }
  }

  console.log('\nTimed out');
}

runTest().catch(err => console.error('Failed:', err));
