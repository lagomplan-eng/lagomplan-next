/**
 * __tests__/login-reason-copy.jest.test.tsx
 *
 * Verifies LoginForm shows contextual copy for each `?reason=` a generation
 * 401 / pre-flight guard redirect can send it (TripResult.tsx's
 * redirectToLoginWithReason): anon_limit_reached, not_authenticated,
 * trip_too_large. No banner when reason is absent or unrecognized — a bare
 * login form is still the correct fallback for direct /login visits.
 *
 * Renders through the real NextIntlClientProvider with the actual
 * messages/{es,en}.json `authGate` namespace (not a next-intl mock) so this
 * test fails if that namespace goes missing or the interpolated {threshold}
 * placeholder breaks — the whole point of moving this copy out of a
 * hardcoded dictionary and into next-intl.
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import LoginForm from '../components/auth/LoginForm'
import { ASYNC_THRESHOLD } from '../lib/plan/limits'
import esMessages from '../messages/es.json'
import enMessages from '../messages/en.json'

let mockReason: string | null = null

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: () => ({ get: (key: string) => (key === 'reason' ? mockReason : null) }),
}))

jest.mock('../lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}))

jest.mock('../lib/supabase/client', () => ({
  getSupabaseBrowser: () => ({
    auth: { signInWithPassword: jest.fn(), resetPasswordForEmail: jest.fn() },
  }),
}))

function renderLoginForm(locale: 'es' | 'en' = 'es') {
  const messages = locale === 'es' ? esMessages : enMessages
  render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginForm />
    </NextIntlClientProvider>
  )
}

describe('LoginForm reason banner', () => {
  afterEach(() => {
    mockReason = null
  })

  it('shows anon_limit_reached copy (es)', () => {
    mockReason = 'anon_limit_reached'
    renderLoginForm('es')
    expect(screen.getByTestId('login-reason-banner')).toHaveTextContent('viaje gratuito')
  })

  it('shows not_authenticated copy (es)', () => {
    mockReason = 'not_authenticated'
    renderLoginForm('es')
    expect(screen.getByTestId('login-reason-banner')).toHaveTextContent('Necesitas una cuenta')
  })

  it('shows trip_too_large copy interpolating the live ASYNC_THRESHOLD value (es)', () => {
    mockReason = 'trip_too_large'
    renderLoginForm('es')
    expect(screen.getByTestId('login-reason-banner')).toHaveTextContent(`${ASYNC_THRESHOLD} días`)
  })

  it('shows trip_too_large copy interpolating the live ASYNC_THRESHOLD value (en)', () => {
    mockReason = 'trip_too_large'
    renderLoginForm('en')
    expect(screen.getByTestId('login-reason-banner')).toHaveTextContent(`${ASYNC_THRESHOLD} days`)
  })

  it('renders no banner when reason is absent', () => {
    mockReason = null
    renderLoginForm('es')
    expect(screen.queryByTestId('login-reason-banner')).not.toBeInTheDocument()
  })

  it('renders no banner for an unrecognized reason', () => {
    mockReason = 'something_unexpected'
    renderLoginForm('es')
    expect(screen.queryByTestId('login-reason-banner')).not.toBeInTheDocument()
  })
})
