/**
 * lib/feature-flags.ts
 *
 * Build-time feature flags. NEXT_PUBLIC_* values are inlined by Next at build, so a
 * change needs a new deployment.
 *
 * NEXT_PUBLIC_FEATURE_SAVED_PLAN=true shows the saved plan on Experiencias and Hoteles
 * ("+ Mi plan" on the cards, the plan bar and the plan panel) and lets the plan_*
 * events fire. Default off: the plan is kept on this device only, and it is hidden
 * until account-based "Guardados" ships. The code stays; the flag only hides it.
 * Read it at call time, never at import, so tests can flip it.
 */
export function isSavedPlanEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FEATURE_SAVED_PLAN === 'true'
}
