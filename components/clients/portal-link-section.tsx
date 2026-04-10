'use client'

import { useState } from 'react'
import { generatePortalToken } from '@/lib/actions/client-portal'
import { Link2, Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface PortalLinkSectionProps {
  clientId: string
  portalToken: string | null
}

export function PortalLinkSection({ clientId, portalToken }: PortalLinkSectionProps) {
  const [token, setToken] = useState(portalToken)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const portalUrl = token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/client/${token}`
    : null

  async function handleGenerate() {
    setGenerating(true)
    const result = await generatePortalToken(clientId)
    setGenerating(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.url) {
      // Extract token from the returned URL path
      const newToken = result.url.replace('/client/', '')
      setToken(newToken)
      toast.success('Portal link generated')
    }
  }

  async function handleCopy() {
    if (!portalUrl) return
    try {
      await navigator.clipboard.writeText(portalUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="bg-card border border-border rounded-[10px] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Client Portal
        </h3>
      </div>

      {token && portalUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={portalUrl}
              className="flex-1 px-3 py-2 text-[12px] text-foreground bg-background border border-border rounded-[6px] outline-none font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-8 h-8 border border-border rounded-[6px] hover:bg-background transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#1A6B40]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 border border-border rounded-[6px] hover:bg-background transition-colors"
              title="Open portal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Share this link with the client. Anyone with the link can view projects.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[12px] text-muted-foreground mb-3">
            Generate a magic link to give this client read-only access to their projects.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-[13px] font-medium rounded-[6px] hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            <Link2 className="w-3.5 h-3.5" />
            {generating ? 'Generating...' : 'Generate Portal Link'}
          </button>
        </div>
      )}
    </div>
  )
}
