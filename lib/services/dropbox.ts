/**
 * Dropbox API wrapper for onboarding automation.
 *
 * Uses plain fetch — no SDK dependency.
 * Auth: App key + refresh token for long-lived access.
 *
 * Env vars: DROPBOX_APP_KEY, DROPBOX_APP_SECRET, DROPBOX_REFRESH_TOKEN
 */

const TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token'
const API_URL = 'https://api.dropboxapi.com/2'

/**
 * Get a short-lived access token using the refresh token.
 */
async function getAccessToken(): Promise<string> {
  const appKey = process.env.DROPBOX_APP_KEY
  const appSecret = process.env.DROPBOX_APP_SECRET
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN

  if (!appKey || !appSecret || !refreshToken) {
    throw new Error('Missing Dropbox env vars (DROPBOX_APP_KEY, DROPBOX_APP_SECRET, DROPBOX_REFRESH_TOKEN)')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${appKey}:${appSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Dropbox token refresh failed (${res.status}): ${text}`)
  }

  const data = await res.json() as { access_token: string }
  return data.access_token
}

/**
 * Create a folder in Dropbox and return a shared link.
 */
export async function createFolder(path: string): Promise<{
  folder_path: string
  shared_link: string
}> {
  const token = await getAccessToken()

  // Create the folder
  const createRes = await fetch(`${API_URL}/files/create_folder_v2`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, autorename: false }),
  })

  if (!createRes.ok) {
    const text = await createRes.text()
    // If folder already exists, that's okay — continue to shared link
    let isConflict = false
    try {
      const errBody = JSON.parse(text)
      isConflict = errBody?.error?.['.tag'] === 'path' &&
        errBody?.error?.path?.['.tag'] === 'conflict'
    } catch {
      // Could not parse JSON — fall back to string matching
      isConflict = text.includes('path/conflict')
    }
    if (!isConflict) {
      throw new Error(`Dropbox create_folder failed (${createRes.status}): ${text}`)
    }
  }

  // Create a shared link for the folder
  const linkRes = await fetch(`${API_URL}/sharing/create_shared_link_with_settings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path,
      settings: { requested_visibility: 'team_only' },
    }),
  })

  let sharedLink = ''
  if (linkRes.ok) {
    const linkData = await linkRes.json() as { url: string }
    sharedLink = linkData.url
  } else {
    // Shared link may already exist — try to get it
    const existingRes = await fetch(`${API_URL}/sharing/list_shared_links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, direct_only: true }),
    })

    if (existingRes.ok) {
      const existingData = await existingRes.json() as { links: Array<{ url: string }> }
      sharedLink = existingData.links?.[0]?.url ?? ''
    }
  }

  return {
    folder_path: path,
    shared_link: sharedLink,
  }
}
