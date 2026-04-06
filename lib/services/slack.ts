/**
 * Slack Web API wrapper for onboarding automation.
 *
 * Uses plain fetch — no SDK dependency.
 * Auth: Bot token (SLACK_BOT_TOKEN) with scopes:
 *   channels:manage, channels:write.invites, chat:write, users:read, users:read.email
 */

const SLACK_API = 'https://slack.com/api'

function getToken(): string {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) throw new Error('Missing SLACK_BOT_TOKEN env var')
  return token
}

async function slackPost<T = Record<string, unknown>>(
  method: string,
  body: Record<string, unknown>
): Promise<T & { ok: boolean; error?: string }> {
  const res = await fetch(`${SLACK_API}/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`Slack API HTTP error: ${res.status} ${res.statusText}`)
  }
  const data = await res.json() as T & { ok: boolean; error?: string }
  if (!data.ok) {
    throw new Error(`Slack API error (${method}): ${data.error}`)
  }
  return data
}

/**
 * Resolve a Slack user ID from an email address.
 * Returns null if the user is not found (e.g. external client not in workspace).
 */
async function lookupUserByEmail(email: string): Promise<string | null> {
  try {
    const data = await slackPost<{ user: { id: string } }>('users.lookupByEmail', { email })
    return data.user.id
  } catch {
    // user not found in workspace — skip silently
    return null
  }
}

/**
 * Create a public Slack channel.
 * If the name is taken, appends -2, -3, etc.
 */
export async function createChannel(name: string): Promise<{
  channel_id: string
  channel_name: string
  channel_url: string
}> {
  let channelName = name.slice(0, 80) // Slack 80-char limit
  let attempt = 0

  while (true) {
    const tryName = attempt === 0 ? channelName : `${channelName.slice(0, 77)}-${attempt + 1}`
    try {
      const data = await slackPost<{ channel: { id: string; name: string } }>(
        'conversations.create',
        { name: tryName, is_private: false }
      )
      return {
        channel_id: data.channel.id,
        channel_name: `#${data.channel.name}`,
        channel_url: `https://slack.com/app_redirect?channel=${data.channel.id}`,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('name_taken') && attempt < 5) {
        attempt++
        continue
      }
      throw err
    }
  }
}

/**
 * Invite users (by email) to a Slack channel.
 * Silently skips emails that don't resolve to workspace users.
 */
export async function inviteToChannel(
  channelId: string,
  emails: string[]
): Promise<{ invited_users: string[] }> {
  const userIds: string[] = []
  for (const email of emails) {
    const uid = await lookupUserByEmail(email)
    if (uid) userIds.push(uid)
  }

  const invited: string[] = []
  for (const uid of userIds) {
    try {
      await slackPost('conversations.invite', {
        channel: channelId,
        users: uid,
      })
      invited.push(uid)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('already_in_channel') || message.includes('cant_invite_self')) {
        // Expected — skip silently
        invited.push(uid)
        continue
      }
      console.error(`Failed to invite user ${uid} to channel ${channelId}:`, message)
    }
  }

  return { invited_users: invited }
}

/**
 * Post a message to a Slack channel.
 */
export async function sendMessage(
  channelId: string,
  text: string
): Promise<{ message_ts: string }> {
  const data = await slackPost<{ ts: string }>('chat.postMessage', {
    channel: channelId,
    text,
  })
  return { message_ts: data.ts }
}

/**
 * Send a direct message to a user by email.
 * Resolves email to user ID, then posts a DM.
 */
export async function sendDM(
  userEmail: string,
  text: string
): Promise<{ message_ts: string }> {
  const userId = await lookupUserByEmail(userEmail)
  if (!userId) {
    throw new Error(`Cannot send DM: user not found for ${userEmail}`)
  }
  const data = await slackPost<{ ts: string }>('chat.postMessage', {
    channel: userId,
    text,
  })
  return { message_ts: data.ts }
}
