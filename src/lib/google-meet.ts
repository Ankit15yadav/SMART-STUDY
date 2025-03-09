'use server'
import { promises as fs } from 'fs';
import * as path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { v2 } from '@google-apps/meet';
import { auth } from 'google-auth-library';

const { SpacesServiceClient } = v2;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created'];

// Safely load credentials
const CREDENTIALS = require("./smart-study-452816-ced4243b2e7a.json");

// Path configuration
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH, 'utf8');
        return auth.fromJSON(JSON.parse(content));
    } catch (err) {
        console.log('No valid token found');
        return null;
    }
}

/**
 * Serializes credentials to a file.
 */
async function saveCredentials(client: any) {
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: CREDENTIALS.client_id,
        client_secret: CREDENTIALS.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Authentication handler
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) return client;

    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: JSON.stringify(CREDENTIALS),
    }) as any;

    if (client?.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Creates a new meeting space
 */
async function createMeeting() {
    try {
        const authClient = await authorize();
        if (!authClient) {
            throw new Error('Authorization failed');
        }
        const meetClient = new SpacesServiceClient({ authClient });

        const [response] = await meetClient.createSpace({});
        return { meetUrl: response.meetingUri };
    } catch (error) {
        console.error('Meeting creation failed:', error);
        throw new Error('Failed to create meeting');
    }
}
// Execute the meeting creation
createMeeting().then(console.log).catch(console.error);