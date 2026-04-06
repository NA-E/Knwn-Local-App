#!/usr/bin/env node
/**
 * Known Local MCP Server (HTTP + stdio)
 *
 * Connects Claude to the Known Local YouTube agency ops system.
 * Supports both:
 *   - HTTP transport (for Claude.ai custom connectors / remote MCP)
 *   - stdio transport (for Claude Desktop / Claude Code local)
 *
 * Auth: Signs in with KNOWNLOCAL_EMAIL + KNOWNLOCAL_PASSWORD on startup.
 * RLS policies enforce access control — no application-level filtering needed.
 *
 * Environment variables:
 *   SUPABASE_URL          - Supabase project URL
 *   SUPABASE_ANON_KEY     - Supabase anon/public key
 *   KNOWNLOCAL_EMAIL      - Admin login email
 *   KNOWNLOCAL_PASSWORD   - Admin login password
 *   MCP_TRANSPORT         - "http" or "stdio" (default: "stdio")
 *   PORT                  - HTTP port (default: 3001)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { createServer } from 'http';
import {
  signIn,
  supabaseQuery,
  supabaseInsert,
  supabaseUpdate,
  supabaseDelete,
} from './supabase.js';

// ============================================================================
// Auth
// ============================================================================

const KNOWNLOCAL_EMAIL = process.env.KNOWNLOCAL_EMAIL;
const KNOWNLOCAL_PASSWORD = process.env.KNOWNLOCAL_PASSWORD;

if (!KNOWNLOCAL_EMAIL || !KNOWNLOCAL_PASSWORD) {
  console.error('Missing KNOWNLOCAL_EMAIL or KNOWNLOCAL_PASSWORD environment variables');
  process.exit(1);
}

// ============================================================================
// Server Setup
// ============================================================================

const server = new McpServer(
  {
    name: 'knownlocal',
    version: '1.0.0',
  },
  {
    instructions:
      'Known Local ops platform MCP server. Use list_* tools to browse data, get_* for full details. Clients have channels, contacts, and team assignments as sub-entities. Team members are assigned to pods and can be assigned to clients via assignment roles (strategist, manager, senior_editor, editor, designer, senior_designer, senior_writer).',
  },
);

// ============================================================================
// Tool: list_clients
// ============================================================================

server.tool(
  'list_clients',
  'List clients in the Known Local system. Optionally filter by search term, status, or pod. Returns client name, pod, channels, and team assignments.',
  {
    search: z.string().optional().describe('Search by client name (partial match)'),
    status: z.enum(['template', 'onboarding', 'active', 'disengaged', 'pending', 'inactive']).optional().describe('Client status filter'),
    pod_id: z.string().uuid().optional().describe('Filter by pod UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ search, status, pod_id }) => {
    try {
      const filters: Record<string, string> = {};
      if (search) filters['name'] = `ilike.*${search}*`;
      if (status) filters['status'] = `eq.${status}`;
      if (pod_id) filters['pod_id'] = `eq.${pod_id}`;

      const clients = await supabaseQuery<any[]>({
        table: 'clients',
        select: '*,pods(name),client_channels(videos_per_week),client_assignments(assignment_role,team_members(first_name,last_name))',
        filters,
        order: 'name.asc',
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ count: clients.length, clients }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error listing clients: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: get_client
// ============================================================================

server.tool(
  'get_client',
  'Get full details for a specific client by ID. Returns client info, pod, channels, contacts, and team assignments.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ client_id }) => {
    try {
      const clients = await supabaseQuery<any[]>({
        table: 'clients',
        select: '*,pods(name),client_channels(*),client_contacts(*),client_assignments(assignment_role,team_members(id,first_name,last_name,role))',
        filters: { 'id': `eq.${client_id}` },
        limit: 1,
      });

      if (clients.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `Client not found: ${client_id}` }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(clients[0], null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error fetching client: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: create_client
// ============================================================================

server.tool(
  'create_client',
  'Create a new client in the Known Local system. Only name is required; all other fields are optional.',
  {
    name: z.string().describe('Client name (required)'),
    market: z.string().optional().describe('Client market/niche'),
    timezone: z.string().optional().describe('Client timezone'),
    website: z.string().optional().describe('Client website URL'),
    youtube_channel_url: z.string().optional().describe('YouTube channel URL'),
    status: z.enum(['template', 'onboarding', 'active', 'disengaged', 'pending', 'inactive']).optional().describe('Client status (default: onboarding)'),
    pod_id: z.string().uuid().optional().describe('Pod UUID to assign client to'),
    package: z.string().optional().describe('Service package'),
    posting_schedule: z.string().optional().describe('Posting schedule description'),
    script_format: z.enum(['word_for_word', 'outline']).optional().describe('Preferred script format'),
    communication_method: z.enum(['slack', 'email', 'other']).optional().describe('Preferred communication method'),
    special_instructions: z.string().optional().describe('Special instructions or notes'),
  },
  { destructiveHint: false },
  async (params) => {
    try {
      const body: Record<string, unknown> = { name: params.name };
      if (params.market !== undefined) body.market = params.market;
      if (params.timezone !== undefined) body.timezone = params.timezone;
      if (params.website !== undefined) body.website = params.website;
      if (params.youtube_channel_url !== undefined) body.youtube_channel_url = params.youtube_channel_url;
      if (params.status !== undefined) body.status = params.status;
      if (params.pod_id !== undefined) body.pod_id = params.pod_id;
      if (params.package !== undefined) body.package = params.package;
      if (params.posting_schedule !== undefined) body.posting_schedule = params.posting_schedule;
      if (params.script_format !== undefined) body.script_format = params.script_format;
      if (params.communication_method !== undefined) body.communication_method = params.communication_method;
      if (params.special_instructions !== undefined) body.special_instructions = params.special_instructions;

      const created = await supabaseInsert<any>('clients', body);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(created, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error creating client: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: update_client
// ============================================================================

server.tool(
  'update_client',
  'Update an existing client. Provide client_id and any fields to change.',
  {
    client_id: z.string().uuid().describe('The client UUID to update'),
    name: z.string().optional().describe('Client name'),
    market: z.string().optional().describe('Client market/niche'),
    timezone: z.string().optional().describe('Client timezone'),
    website: z.string().optional().describe('Client website URL'),
    youtube_channel_url: z.string().optional().describe('YouTube channel URL'),
    status: z.enum(['template', 'onboarding', 'active', 'disengaged', 'pending', 'inactive']).optional().describe('Client status'),
    pod_id: z.string().uuid().optional().describe('Pod UUID'),
    package: z.string().optional().describe('Service package'),
    posting_schedule: z.string().optional().describe('Posting schedule'),
    script_format: z.enum(['word_for_word', 'outline']).optional().describe('Script format'),
    communication_method: z.enum(['slack', 'email', 'other']).optional().describe('Communication method'),
    special_instructions: z.string().optional().describe('Special instructions'),
  },
  { idempotentHint: true, destructiveHint: false },
  async ({ client_id, ...fields }) => {
    try {
      const body: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) body[key] = value;
      }

      if (Object.keys(body).length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'No fields provided to update.' }],
          isError: true,
        };
      }

      const updated = await supabaseUpdate<any>('clients', body, { 'id': `eq.${client_id}` });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(updated, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error updating client: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: list_team_members
// ============================================================================

server.tool(
  'list_team_members',
  'List team members. Optionally filter by role or status. Returns member info and pod assignments.',
  {
    role: z.enum(['admin', 'strategist', 'jr_strategist', 'manager', 'senior_editor', 'senior_writer', 'senior_designer', 'editor', 'writer', 'designer']).optional().describe('Team role filter'),
    status: z.enum(['active', 'inactive']).optional().describe('Member status filter'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ role, status }) => {
    try {
      const filters: Record<string, string> = {};
      if (role) filters['role'] = `eq.${role}`;
      if (status) filters['status'] = `eq.${status}`;

      const members = await supabaseQuery<any[]>({
        table: 'team_members',
        select: '*,team_member_pods(pod_id,is_primary,pods(id,name))',
        filters,
        order: 'last_name.asc',
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ count: members.length, team_members: members }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error listing team members: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: get_team_member
// ============================================================================

server.tool(
  'get_team_member',
  'Get full details for a specific team member by ID, including pod assignments.',
  {
    team_member_id: z.string().uuid().describe('The team member UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ team_member_id }) => {
    try {
      const members = await supabaseQuery<any[]>({
        table: 'team_members',
        select: '*,team_member_pods(pod_id,is_primary,pods(id,name))',
        filters: { 'id': `eq.${team_member_id}` },
        limit: 1,
      });

      if (members.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `Team member not found: ${team_member_id}` }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(members[0], null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error fetching team member: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: create_team_member
// ============================================================================

server.tool(
  'create_team_member',
  'Create a new team member. Optionally assign to pods. If pod_ids are provided, also specify primary_pod_id to mark which pod is primary.',
  {
    first_name: z.string().describe('First name (required)'),
    last_name: z.string().describe('Last name (required)'),
    email: z.string().email().describe('Email address (required)'),
    role: z.enum(['admin', 'strategist', 'jr_strategist', 'manager', 'senior_editor', 'senior_writer', 'senior_designer', 'editor', 'writer', 'designer']).describe('Team role (required)'),
    supervised_by: z.string().uuid().optional().describe('UUID of supervising team member'),
    pod_ids: z.array(z.string().uuid()).optional().describe('Array of pod UUIDs to assign'),
    primary_pod_id: z.string().uuid().optional().describe('Which pod UUID is the primary assignment'),
  },
  { destructiveHint: false },
  async ({ first_name, last_name, email, role, supervised_by, pod_ids, primary_pod_id }) => {
    try {
      const body: Record<string, unknown> = { first_name, last_name, email, role };
      if (supervised_by !== undefined) body.supervised_by = supervised_by;

      const created = await supabaseInsert<any>('team_members', body);

      // If pod_ids provided, insert team_member_pods rows
      if (pod_ids && pod_ids.length > 0) {
        for (const podId of pod_ids) {
          await supabaseInsert('team_member_pods', {
            team_member_id: created.id,
            pod_id: podId,
            is_primary: podId === primary_pod_id,
          });
        }
      }

      // Re-fetch with pod data
      const result = await supabaseQuery<any[]>({
        table: 'team_members',
        select: '*,team_member_pods(pod_id,is_primary,pods(id,name))',
        filters: { 'id': `eq.${created.id}` },
        limit: 1,
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(result[0] || created, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error creating team member: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: update_team_member
// ============================================================================

server.tool(
  'update_team_member',
  'Update an existing team member. Provide team_member_id and any fields to change. If pod_ids is provided, replaces all pod assignments.',
  {
    team_member_id: z.string().uuid().describe('The team member UUID to update'),
    first_name: z.string().optional().describe('First name'),
    last_name: z.string().optional().describe('Last name'),
    email: z.string().email().optional().describe('Email address'),
    role: z.enum(['admin', 'strategist', 'jr_strategist', 'manager', 'senior_editor', 'senior_writer', 'senior_designer', 'editor', 'writer', 'designer']).optional().describe('Team role'),
    status: z.enum(['active', 'inactive']).optional().describe('Member status'),
    supervised_by: z.string().uuid().optional().describe('UUID of supervising team member'),
    pod_ids: z.array(z.string().uuid()).optional().describe('Replace pod assignments with these pod UUIDs'),
    primary_pod_id: z.string().uuid().optional().describe('Which pod UUID is the primary assignment'),
  },
  { idempotentHint: true, destructiveHint: false },
  async ({ team_member_id, pod_ids, primary_pod_id, ...fields }) => {
    try {
      const body: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) body[key] = value;
      }

      // Update the team member row if there are field changes
      if (Object.keys(body).length > 0) {
        await supabaseUpdate<any>('team_members', body, { 'id': `eq.${team_member_id}` });
      }

      // Handle pod reassignment: delete old, insert new
      if (pod_ids !== undefined) {
        await supabaseDelete('team_member_pods', { 'team_member_id': `eq.${team_member_id}` });

        for (const podId of pod_ids) {
          await supabaseInsert('team_member_pods', {
            team_member_id,
            pod_id: podId,
            is_primary: podId === primary_pod_id,
          });
        }
      }

      // Re-fetch with pod data
      const result = await supabaseQuery<any[]>({
        table: 'team_members',
        select: '*,team_member_pods(pod_id,is_primary,pods(id,name))',
        filters: { 'id': `eq.${team_member_id}` },
        limit: 1,
      });

      if (result.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `Team member not found: ${team_member_id}` }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(result[0], null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error updating team member: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: list_pods
// ============================================================================

server.tool(
  'list_pods',
  'List all pods in the Known Local system. Returns pod names and IDs.',
  { readOnlyHint: true, destructiveHint: false },
  async () => {
    try {
      const pods = await supabaseQuery<any[]>({
        table: 'pods',
        select: '*',
        order: 'name.asc',
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ count: pods.length, pods }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error listing pods: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: create_pod
// ============================================================================

server.tool(
  'create_pod',
  'Create a new pod.',
  {
    name: z.string().describe('Pod name (required)'),
  },
  { destructiveHint: false },
  async ({ name }) => {
    try {
      const created = await supabaseInsert<any>('pods', { name });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(created, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error creating pod: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: update_pod
// ============================================================================

server.tool(
  'update_pod',
  'Update an existing pod name.',
  {
    pod_id: z.string().uuid().describe('The pod UUID to update'),
    name: z.string().describe('New pod name'),
  },
  { idempotentHint: true, destructiveHint: false },
  async ({ pod_id, name }) => {
    try {
      const updated = await supabaseUpdate<any>('pods', { name }, { 'id': `eq.${pod_id}` });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(updated, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error updating pod: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: list_client_channels
// ============================================================================

server.tool(
  'list_client_channels',
  'List all YouTube channels for a specific client.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ client_id }) => {
    try {
      const channels = await supabaseQuery<any[]>({
        table: 'client_channels',
        select: '*',
        filters: { 'client_id': `eq.${client_id}` },
        order: 'channel_name.asc',
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ count: channels.length, channels }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error listing client channels: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: add_client_channel
// ============================================================================

server.tool(
  'add_client_channel',
  'Add a new YouTube channel to a client.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
    channel_name: z.string().describe('Channel name (required)'),
    channel_url: z.string().optional().describe('Channel URL'),
    videos_per_week: z.number().optional().describe('Number of videos per week (default: 1)'),
  },
  { destructiveHint: false },
  async ({ client_id, channel_name, channel_url, videos_per_week }) => {
    try {
      const body: Record<string, unknown> = {
        client_id,
        channel_name,
        videos_per_week: videos_per_week ?? 1,
      };
      if (channel_url !== undefined) body.channel_url = channel_url;

      const created = await supabaseInsert<any>('client_channels', body);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(created, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error adding client channel: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: update_client_channel
// ============================================================================

server.tool(
  'update_client_channel',
  'Update an existing client channel.',
  {
    channel_id: z.string().uuid().describe('The channel UUID to update'),
    channel_name: z.string().optional().describe('Channel name'),
    channel_url: z.string().optional().describe('Channel URL'),
    videos_per_week: z.number().optional().describe('Videos per week'),
  },
  { idempotentHint: true, destructiveHint: false },
  async ({ channel_id, ...fields }) => {
    try {
      const body: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) body[key] = value;
      }

      if (Object.keys(body).length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'No fields provided to update.' }],
          isError: true,
        };
      }

      const updated = await supabaseUpdate<any>('client_channels', body, { 'id': `eq.${channel_id}` });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(updated, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error updating client channel: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: delete_client_channel
// ============================================================================

server.tool(
  'delete_client_channel',
  'Delete a client channel by ID.',
  {
    channel_id: z.string().uuid().describe('The channel UUID to delete'),
  },
  { destructiveHint: true, idempotentHint: true },
  async ({ channel_id }) => {
    try {
      await supabaseDelete('client_channels', { 'id': `eq.${channel_id}` });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ success: true, deleted: channel_id }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error deleting client channel: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: list_client_contacts
// ============================================================================

server.tool(
  'list_client_contacts',
  'List all contacts for a specific client.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ client_id }) => {
    try {
      const contacts = await supabaseQuery<any[]>({
        table: 'client_contacts',
        select: '*',
        filters: { 'client_id': `eq.${client_id}` },
        order: 'contact_name.asc',
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ count: contacts.length, contacts }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error listing client contacts: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: add_client_contact
// ============================================================================

server.tool(
  'add_client_contact',
  'Add a new contact to a client.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
    email: z.string().email().describe('Contact email (required)'),
    contact_name: z.string().optional().describe('Contact name'),
    phone: z.string().optional().describe('Phone number'),
    is_primary: z.boolean().optional().describe('Is this the primary contact? (default: false)'),
    is_assistant: z.boolean().optional().describe('Is this an assistant contact? (default: false)'),
  },
  { destructiveHint: false },
  async ({ client_id, email, contact_name, phone, is_primary, is_assistant }) => {
    try {
      const body: Record<string, unknown> = { client_id, email };
      if (contact_name !== undefined) body.contact_name = contact_name;
      if (phone !== undefined) body.phone = phone;
      if (is_primary !== undefined) body.is_primary = is_primary;
      if (is_assistant !== undefined) body.is_assistant = is_assistant;

      const created = await supabaseInsert<any>('client_contacts', body);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(created, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error adding client contact: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: update_client_contact
// ============================================================================

server.tool(
  'update_client_contact',
  'Update an existing client contact.',
  {
    contact_id: z.string().uuid().describe('The contact UUID to update'),
    email: z.string().email().optional().describe('Contact email'),
    contact_name: z.string().optional().describe('Contact name'),
    phone: z.string().optional().describe('Phone number'),
    is_primary: z.boolean().optional().describe('Is primary contact'),
    is_assistant: z.boolean().optional().describe('Is assistant contact'),
  },
  { idempotentHint: true, destructiveHint: false },
  async ({ contact_id, ...fields }) => {
    try {
      const body: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) body[key] = value;
      }

      if (Object.keys(body).length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'No fields provided to update.' }],
          isError: true,
        };
      }

      const updated = await supabaseUpdate<any>('client_contacts', body, { 'id': `eq.${contact_id}` });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(updated, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error updating client contact: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: delete_client_contact
// ============================================================================

server.tool(
  'delete_client_contact',
  'Delete a client contact by ID.',
  {
    contact_id: z.string().uuid().describe('The contact UUID to delete'),
  },
  { destructiveHint: true, idempotentHint: true },
  async ({ contact_id }) => {
    try {
      await supabaseDelete('client_contacts', { 'id': `eq.${contact_id}` });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ success: true, deleted: contact_id }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error deleting client contact: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: get_client_assignments
// ============================================================================

server.tool(
  'get_client_assignments',
  'Get all team member assignments for a specific client. Shows who is assigned to each role (manager, strategist, senior_editor, designer).',
  {
    client_id: z.string().uuid().describe('The client UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ client_id }) => {
    try {
      const assignments = await supabaseQuery<any[]>({
        table: 'client_assignments',
        select: '*,team_members(id,first_name,last_name,role)',
        filters: { 'client_id': `eq.${client_id}` },
        order: 'assignment_role.asc',
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ count: assignments.length, assignments }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error fetching client assignments: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: assign_team_member
// ============================================================================

server.tool(
  'assign_team_member',
  'Assign (or unassign) a team member to a client role. Replaces any existing assignment for that role. To unassign, omit team_member_id.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
    assignment_role: z.enum(['strategist', 'manager', 'editor', 'senior_editor', 'designer', 'senior_designer', 'senior_writer']).describe('Assignment role'),
    team_member_id: z.string().uuid().optional().describe('Team member UUID to assign. Omit to unassign the role.'),
  },
  { idempotentHint: true },
  async ({ client_id, assignment_role, team_member_id }) => {
    try {
      // Delete existing assignment for this client + role
      await supabaseDelete('client_assignments', {
        'client_id': `eq.${client_id}`,
        'assignment_role': `eq.${assignment_role}`,
      });

      // Insert new assignment if team_member_id provided
      if (team_member_id) {
        const created = await supabaseInsert<any>('client_assignments', {
          client_id,
          assignment_role,
          team_member_id,
        });

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(created, null, 2),
          }],
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ success: true, message: `Unassigned ${assignment_role} from client ${client_id}` }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error assigning team member: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Tool: get_onboarding_status
// ============================================================================

server.tool(
  'get_onboarding_status',
  'Get the onboarding step statuses for a specific client. Returns all steps (slack_channel, dropbox_folder, gdrive_folder, slack_invite, welcome_message, team_notify) with their current status (pending, running, success, failed, skipped), result data, and error messages.',
  {
    client_id: z.string().uuid().describe('The client UUID'),
  },
  { readOnlyHint: true, destructiveHint: false },
  async ({ client_id }) => {
    try {
      const steps = await supabaseQuery<any[]>({
        table: 'onboarding_steps',
        select: '*',
        filters: { 'client_id': `eq.${client_id}` },
        order: 'created_at.asc',
      });

      if (steps.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No onboarding steps found for client ${client_id}. This client may have been created before onboarding automation was enabled.`,
          }],
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ client_id, step_count: steps.length, steps }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: `Error fetching onboarding status: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  }
);

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  // Sign in to Known Local (Supabase Auth) — gets JWT for RLS
  await signIn(KNOWNLOCAL_EMAIL!, KNOWNLOCAL_PASSWORD!);

  const transport = process.env.MCP_TRANSPORT || 'stdio';

  if (transport === 'stdio') {
    // Local mode: Claude Desktop / Claude Code
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
    console.error('Known Local MCP server running on stdio');
  } else {
    // Remote mode: Claude.ai custom connector
    const PORT = parseInt(process.env.PORT || '3001', 10);

    const httpServer = createServer(async (req, res) => {
      // CORS headers for Claude connector
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id');
      res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      // Health check
      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', server: 'knownlocal-mcp' }));
        return;
      }

      // MCP endpoint
      if (req.url === '/mcp') {
        const httpTransport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });

        res.on('close', () => {
          httpTransport.close().catch(() => {});
        });

        await server.connect(httpTransport);
        await httpTransport.handleRequest(req, res);
        return;
      }

      // 404 for everything else
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found. MCP endpoint is at /mcp' }));
    });

    httpServer.listen(PORT, () => {
      console.error(`Known Local MCP server running on http://0.0.0.0:${PORT}/mcp`);
    });
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
