'use client'

/**
 * components/util/DomMutationGuard.tsx
 *
 * Hardens the two DOM methods React uses during reconciliation —
 * Node.prototype.removeChild and Node.prototype.insertBefore — so the
 * app survives third-party scripts that mutate the DOM out from under
 * React.
 *
 * The bug it fixes
 * ----------------
 * Chrome's built-in auto-translate (Google Translate) rewrites text
 * nodes — it wraps them in <font> tags and reorders them. React still
 * holds references to the *original* nodes, so on the next commit it
 * calls removeChild / insertBefore against a node Translate already
 * replaced. The DOM throws DOMException NotFoundError, which on WebKit
 * (incl. Chrome on iOS) reads "The object can not be found here." That
 * exception is uncaught, so Next's error boundary swaps the whole trip
 * view for the "Unexpected error" page ~1s after it renders.
 *
 * Repro profile: mobile Chrome auto-translating an itinerary full of
 * foreign place / hotel names. Safari uses Apple's translate, which
 * doesn't trip React the same way — hence "works in Safari, dies in
 * Chrome." Travel content is uniquely prone because place names read as
 * a foreign language even on the correct locale.
 *
 * The fix
 * -------
 * The React-team-known workaround (facebook/react#11538): when the node
 * to remove / the reference node isn't actually a child of `this`, treat
 * it as already-handled instead of throwing. Behaviour is unchanged in
 * every normal case — we only diverge in the exact state that would have
 * thrown. This keeps Chrome translation working for users who want it
 * while making React resilient to its (and any extension's / injected
 * script's) DOM surgery.
 *
 * Patched at module load so it's in place before React commits on the
 * client; the component just mounts the module and is a defensive
 * re-apply. Guarded for SSR ('use client' modules also evaluate on the
 * server) and idempotent.
 */

import { useEffect } from 'react'

let patched = false

function patchDomMutationMethods() {
  if (patched) return
  if (typeof window === 'undefined' || typeof Node === 'undefined') return
  patched = true

  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[dom-guard] removeChild: node is not a child of the expected parent; ignoring', child)
      }
      return child
    }
    return originalRemoveChild.call(this, child) as T
  } as typeof Node.prototype.removeChild

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[dom-guard] insertBefore: reference node is not a child of the expected parent; appending instead', referenceNode)
      }
      return originalInsertBefore.call(this, newNode, null) as T
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T
  } as typeof Node.prototype.insertBefore
}

// Apply as early as possible — at module evaluation on the client.
patchDomMutationMethods()

export default function DomMutationGuard() {
  useEffect(() => {
    patchDomMutationMethods()
  }, [])
  return null
}
