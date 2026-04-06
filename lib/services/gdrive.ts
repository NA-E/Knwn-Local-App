/**
 * Google Drive API wrapper for onboarding automation.
 *
 * Auth: Service account with JWT (via google-auth-library).
 *
 * Env vars: GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_DRIVE_PARENT_FOLDER_ID
 */

import { GoogleAuth } from 'google-auth-library'

const DRIVE_API = 'https://www.googleapis.com/drive/v3'

/**
 * Get an access token from Google service account credentials.
 */
async function getAccessToken(): Promise<string> {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!credentialsJson) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON env var')
  }

  const credentials = JSON.parse(credentialsJson)
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })

  const client = await auth.getClient()
  const tokenResponse = await client.getAccessToken()
  const token = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token
  if (!token) {
    throw new Error('Failed to get Google Drive access token')
  }
  return token
}

/**
 * Create a folder in Google Drive under the specified parent folder.
 */
export async function createFolder(
  name: string,
  parentFolderId: string
): Promise<{
  folder_id: string
  folder_url: string
}> {
  const token = await getAccessToken()

  const res = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google Drive create folder failed (${res.status}): ${text}`)
  }

  const data = await res.json() as { id: string }

  return {
    folder_id: data.id,
    folder_url: `https://drive.google.com/drive/folders/${data.id}`,
  }
}
