import * as admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!process.env.FIREBASE_PROJECT_ID || 
    !privateKey || 
    !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('Missing Firebase Admin SDK credentials in environment variables');
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});

export const auth = admin.auth(); 