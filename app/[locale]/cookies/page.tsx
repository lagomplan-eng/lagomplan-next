/**
 * app/[locale]/cookies/page.tsx
 * Route ES: /es/cookies   Route EN: /en/cookies
 */
import type { Metadata } from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale } from '../../../i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title:      locale === 'es' ? 'Política de Cookies' : 'Cookie Policy',
    alternates: buildAlternates('cookies'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  if (locale === 'en') return <CookiePolicyEN />
  return <CookiePolicyES />
}

// ── Shared primitives ──────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">
      {children}
    </h2>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">
      {children}
    </h3>
  )
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2">{children}</ul>
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  )
}

function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-[#EDE7E1] text-[#1F3D37]">
      <tr>{children}</tr>
    </thead>
  )
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-2 font-semibold border border-[#D9D2C9]">
      {children}
    </th>
  )
}

function TD({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-2 border border-[#D9D2C9] align-top">
      {children}
    </td>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-[#1F3D37]"
    >
      {children}
    </a>
  )
}

function MailLink({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} className="underline hover:text-[#1F3D37]">
      {address}
    </a>
  )
}

// ── English version ────────────────────────────────────────

function CookiePolicyEN() {
  return (
    <section className="bg-[#F7F4EF] min-h-screen pt-[72px]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D37] mb-2">
          Cookie Policy
        </h1>
        <p className="text-sm text-neutral-500 mb-10">Last updated: April 22, 2026</p>

        <div className="text-neutral-700 leading-relaxed text-base space-y-4">

          {/* 1 */}
          <H2>1. What Are Cookies</H2>
          <p>
            Cookies are small text files stored on your device when you visit a website.
            They allow a site to remember information about your visit — such as your
            language, session status, or interaction history — across pages and sessions.
          </p>
          <p>Cookies can be:</p>
          <UL>
            <li><span className="font-medium">First-party</span> — set directly by LagomPlan</li>
            <li><span className="font-medium">Third-party</span> — set by external services we integrate (e.g. analytics providers, affiliate networks)</li>
            <li><span className="font-medium">Session-based</span> — deleted when you close your browser</li>
            <li><span className="font-medium">Persistent</span> — stored for a defined period after you leave</li>
          </UL>

          {/* 2 */}
          <H2>2. How We Use Cookies</H2>
          <p>
            LagomPlan uses cookies to operate the platform, understand how it is used, and
            support affiliate partnerships that fund our editorial work.
          </p>
          <p className="font-medium text-[#1F3D37]">
            We do not place or activate non-essential cookies without your prior, freely
            given, and informed consent.
          </p>
          <p>
            Analytics, affiliate tracking, and preference cookies are inactive until you
            explicitly accept them. Strictly necessary cookies are the only cookies active
            by default — they are required for the platform to function and do not require
            consent under the ePrivacy Directive.
          </p>

          {/* 3 */}
          <H2>3. Types of Cookies We Use</H2>

          <H3>Strictly Necessary</H3>
          <p>
            Always active. These cannot be disabled because the platform cannot function
            without them. No personal data collected through these cookies is shared with
            third parties for any purpose other than security and session management.
          </p>
          <TableWrapper>
            <THead>
              <TH>Cookie</TH>
              <TH>Purpose</TH>
              <TH>Duration</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Session token</TD>
                <TD>Maintains your session while using the platform</TD>
                <TD>Session</TD>
              </tr>
              <tr>
                <TD>CSRF token</TD>
                <TD>Prevents cross-site request forgery attacks</TD>
                <TD>Session</TD>
              </tr>
              <tr>
                <TD>Consent record</TD>
                <TD>Stores your cookie consent choice and timestamp</TD>
                <TD>12 months</TD>
              </tr>
            </tbody>
          </TableWrapper>

          <H3>Analytics</H3>
          <p className="font-medium">Requires consent. Off by default.</p>
          <p>
            These cookies allow us to measure how users interact with LagomPlan — including
            which guides are read, navigation paths, and traffic sources. This data informs
            product decisions and content improvements.
          </p>
          <p>
            Data collected through analytics cookies is subject to the privacy policies of
            the analytics provider. IP addresses are collected by the provider and may be
            used to infer approximate geographic location. Data is pseudonymized — it cannot
            directly identify you without additional information held by the provider.
          </p>
          <TableWrapper>
            <THead>
              <TH>Provider</TH>
              <TH>Purpose</TH>
              <TH>Duration</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Google Analytics</TD>
                <TD>Page views, sessions, traffic attribution</TD>
                <TD>Up to 2 years</TD>
              </tr>
            </tbody>
          </TableWrapper>

          <H3>Marketing & Affiliate Tracking</H3>
          <p className="font-medium">Requires consent. Off by default.</p>
          <p>
            LagomPlan earns revenue through affiliate partnerships with travel providers
            including Booking.com. When you click an outbound link to a partner and complete
            a booking, a cookie placed by that partner attributes the referral to LagomPlan
            and triggers a commission payment to us.
          </p>
          <p>
            If you decline this category, outbound links will continue to function normally
            — you will not be disadvantaged in any way — but LagomPlan will not receive
            commission attribution for your booking.
          </p>
          <TableWrapper>
            <THead>
              <TH>Provider</TH>
              <TH>Purpose</TH>
              <TH>Duration</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Booking.com</TD>
                <TD>Affiliate referral attribution</TD>
                <TD>Up to 30 days</TD>
              </tr>
              <tr>
                <TD>Additional affiliate networks</TD>
                <TD>Referral tracking and commission attribution</TD>
                <TD>Varies</TD>
              </tr>
              <tr>
                <TD>Retargeting platforms (future)</TD>
                <TD>Behavioral advertising based on browsing</TD>
                <TD>Up to 90 days</TD>
              </tr>
            </tbody>
          </TableWrapper>

          <H3>Preferences</H3>
          <p className="font-medium">Requires consent. Off by default.</p>
          <p>
            These cookies remember choices you make on LagomPlan — such as your language
            setting — so you do not need to reselect them on every visit.
          </p>
          <TableWrapper>
            <THead>
              <TH>Cookie</TH>
              <TH>Purpose</TH>
              <TH>Duration</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Language</TD>
                <TD>Stores selected language (e.g. Spanish / English)</TD>
                <TD>12 months</TD>
              </tr>
              <tr>
                <TD>UI preferences</TD>
                <TD>Saves display or filter settings</TD>
                <TD>30 days</TD>
              </tr>
            </tbody>
          </TableWrapper>

          {/* 4 */}
          <H2>4. Third-Party Cookies</H2>
          <p>
            The following third-party providers may set cookies on your device when you use
            LagomPlan, subject to your consent choices. LagomPlan does not control how these
            parties collect, use, or retain data beyond what is disclosed in their own
            privacy policies.
          </p>
          <TableWrapper>
            <THead>
              <TH>Provider</TH>
              <TH>Category</TH>
              <TH>Privacy Policy</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Google Analytics</TD>
                <TD>Analytics</TD>
                <TD>
                  <ExternalLink href="https://policies.google.com/privacy">
                    policies.google.com/privacy
                  </ExternalLink>
                </TD>
              </tr>
              <tr>
                <TD>Booking.com</TD>
                <TD>Affiliate tracking</TD>
                <TD>
                  <ExternalLink href="https://www.booking.com/content/privacy.html">
                    booking.com/content/privacy.html
                  </ExternalLink>
                </TD>
              </tr>
              <tr>
                <TD>Additional affiliate partners</TD>
                <TD>Affiliate tracking</TD>
                <TD>Disclosed as relationships are established</TD>
              </tr>
            </tbody>
          </TableWrapper>
          <p>
            We do not permit third-party providers to use data collected through LagomPlan
            for their own advertising or profiling purposes without explicit disclosure in
            this policy.
          </p>

          {/* 5 */}
          <H2>5. Affiliate Disclosure</H2>
          <p>
            LagomPlan recommends hotels, experiences, and travel services based solely on
            editorial judgment. We do not accept payment to feature or rank specific
            providers. Some recommendations include affiliate links — if you click one and
            complete a booking, LagomPlan earns a commission from the provider at no extra
            cost to you.
          </p>
          <p>
            Affiliate tracking requires a cookie or URL parameter to function. If you
            decline the Marketing & Affiliate Tracking category, your bookings through our
            links are unaffected, but LagomPlan will not receive commission for the referral.
            We disclose this because we believe you are entitled to know how our platform is
            funded and what declining tracking means in practical terms.
          </p>

          {/* 6 */}
          <H2>6. Legal Basis (GDPR)</H2>
          <p>
            For users in the European Economic Area and the United Kingdom, the following
            legal bases apply under Regulation (EU) 2016/679 (GDPR):
          </p>
          <TableWrapper>
            <THead>
              <TH>Cookie Category</TH>
              <TH>Legal Basis</TH>
              <TH>GDPR Article</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Strictly necessary</TD>
                <TD>Legitimate interest / performance of a contract</TD>
                <TD>Art. 6(1)(b) and 6(1)(f)</TD>
              </tr>
              <tr>
                <TD>Analytics</TD>
                <TD>Consent</TD>
                <TD>Art. 6(1)(a)</TD>
              </tr>
              <tr>
                <TD>Marketing & affiliate tracking</TD>
                <TD>Consent</TD>
                <TD>Art. 6(1)(a)</TD>
              </tr>
              <tr>
                <TD>Preferences</TD>
                <TD>Consent</TD>
                <TD>Art. 6(1)(a)</TD>
              </tr>
            </tbody>
          </TableWrapper>
          <p>
            Consent is obtained through our cookie banner before any non-essential cookies
            are activated. You may withdraw consent at any time without penalty. Withdrawal
            does not affect the lawfulness of processing carried out prior to withdrawal.
          </p>
          <p>
            For users in California (USA), you may opt out of the sale or sharing of
            personal data as defined under the CCPA/CPRA by rejecting the Marketing &
            Affiliate Tracking and Analytics cookie categories. No financial incentive is
            offered in exchange for consent.
          </p>

          {/* 7 */}
          <H2>7. Managing and Withdrawing Consent</H2>
          <p>You can review and change your cookie preferences at any time.</p>
          <H3>Cookie Settings panel</H3>
          <p>
            A persistent <span className="font-medium">Cookie Settings</span> link is
            available in the footer of every page on LagomPlan. Click it to open the
            preferences panel where you can enable or disable individual categories and
            save your updated choices. Changes take effect immediately for new cookie
            activity.
          </p>
          <H3>Browser-level controls</H3>
          <p>
            You can block or delete cookies at the browser level through your browser
            settings. Note that blocking strictly necessary cookies may prevent parts of
            the platform from working correctly.
          </p>
          <UL>
            <li><span className="font-medium">Chrome:</span> Settings → Privacy and Security → Cookies and other site data</li>
            <li><span className="font-medium">Firefox:</span> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><span className="font-medium">Safari:</span> Preferences → Privacy → Manage Website Data</li>
            <li><span className="font-medium">Edge:</span> Settings → Cookies and site permissions</li>
          </UL>
          <H3>Third-party opt-outs</H3>
          <UL>
            <li>
              Google Analytics:{' '}
              <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                tools.google.com/dlpage/gaoptout
              </ExternalLink>
            </li>
            <li>
              Booking.com:{' '}
              <ExternalLink href="https://www.booking.com/content/privacy.html">
                booking.com/content/privacy.html
              </ExternalLink>
            </li>
          </UL>
          <H3>Re-consent</H3>
          <p>
            Your consent choices are stored for 12 months. After this period, or if you
            clear your cookies, the banner will reappear and request a fresh decision. If
            we materially change our cookie practices, we will treat this as a new consent
            event regardless of the stored timestamp.
          </p>

          {/* 8 */}
          <H2>8. International Data Transfers</H2>
          <p>
            LagomPlan is operated from Mexico. Some third-party providers — including
            Google — are based in the United States and may process data there. The United
            States does not have a blanket adequacy decision from the European Commission
            covering all transfers.
          </p>
          <p>
            Where personal data is transferred outside the EEA to a country without an
            adequacy decision, we rely on:
          </p>
          <UL>
            <li>
              <span className="font-medium">Standard Contractual Clauses (SCCs)</span> as
              approved by the European Commission (Decision 2021/914), which impose binding
              data protection obligations on the recipient
            </li>
            <li>
              <span className="font-medium">Adequacy decisions</span> where applicable
              (e.g. EU-US Data Privacy Framework where the recipient is certified)
            </li>
          </UL>
          <p>
            You may request a copy of the applicable transfer mechanism by contacting us at
            the address in Section 9.
          </p>

          {/* 9 */}
          <H2>9. Contact</H2>
          <p>
            For questions or requests related to this Cookie Policy or your personal data:
          </p>
          <ul className="list-none pl-0 space-y-1">
            <li><span className="font-medium">LagomPlan</span></li>
            <li>
              <span className="font-medium">Email:</span>{' '}
              <MailLink address="privacy@lagomplan.com" />
            </li>
            <li><span className="font-medium">Address:</span> Ciudad de México, México</li>
          </ul>
          <p className="mt-4">
            To file a complaint with a data protection authority, contact your local
            supervisory authority. EU residents can find their authority at{' '}
            <ExternalLink href="https://edpb.europa.eu">edpb.europa.eu</ExternalLink>.
            UK residents may contact the ICO at{' '}
            <ExternalLink href="https://ico.org.uk">ico.org.uk</ExternalLink>.
          </p>

          <p className="mt-12 text-sm text-neutral-500">
            LagomPlan &nbsp;•&nbsp; Cookie Policy v1.0 &nbsp;•&nbsp; April 22, 2026
          </p>

        </div>
      </div>
    </section>
  )
}

// ── Spanish version ────────────────────────────────────────

function CookiePolicyES() {
  return (
    <section className="bg-[#F7F4EF] min-h-screen pt-[72px]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D37] mb-2">
          Política de Cookies
        </h1>
        <p className="text-sm text-neutral-500 mb-10">Última actualización: 22 de abril de 2026</p>

        <div className="text-neutral-700 leading-relaxed text-base space-y-4">

          {/* 1 */}
          <H2>1. ¿Qué son las cookies?</H2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo
            cuando visita un sitio web. Permiten que el sitio recuerde información sobre
            su visita — como su idioma, estado de sesión o historial de interacción —
            entre páginas y sesiones.
          </p>
          <p>Las cookies pueden ser:</p>
          <UL>
            <li><span className="font-medium">De origen (first-party)</span> — establecidas directamente por LagomPlan</li>
            <li><span className="font-medium">De terceros</span> — establecidas por servicios externos que integramos (p. ej. proveedores de analítica, redes de afiliados)</li>
            <li><span className="font-medium">De sesión</span> — se eliminan cuando cierra el navegador</li>
            <li><span className="font-medium">Persistentes</span> — se conservan durante un período definido después de su visita</li>
          </UL>

          {/* 2 */}
          <H2>2. Cómo usamos las cookies</H2>
          <p>
            LagomPlan usa cookies para operar la plataforma, entender cómo se utiliza y
            dar soporte a las asociaciones de afiliados que financian nuestro trabajo
            editorial.
          </p>
          <p className="font-medium text-[#1F3D37]">
            No activamos cookies no esenciales sin su consentimiento previo, libre e
            informado.
          </p>
          <p>
            Las cookies de analítica, seguimiento de afiliados y preferencias permanecen
            inactivas hasta que usted las acepte explícitamente. Solo las cookies
            estrictamente necesarias están activas por defecto — son imprescindibles para
            el funcionamiento de la plataforma y no requieren consentimiento bajo la
            Directiva ePrivacy.
          </p>

          {/* 3 */}
          <H2>3. Tipos de cookies que usamos</H2>

          <H3>Estrictamente necesarias</H3>
          <p>
            Siempre activas. No pueden desactivarse porque la plataforma no puede funcionar
            sin ellas. Los datos personales recopilados a través de estas cookies no se
            comparten con terceros para ningún fin que no sea la seguridad y la gestión
            de la sesión.
          </p>
          <TableWrapper>
            <THead>
              <TH>Cookie</TH>
              <TH>Finalidad</TH>
              <TH>Duración</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Token de sesión</TD>
                <TD>Mantiene su sesión mientras usa la plataforma</TD>
                <TD>Sesión</TD>
              </tr>
              <tr>
                <TD>Token CSRF</TD>
                <TD>Previene ataques de falsificación de solicitudes entre sitios</TD>
                <TD>Sesión</TD>
              </tr>
              <tr>
                <TD>Registro de consentimiento</TD>
                <TD>Almacena su elección de consentimiento de cookies y la marca de tiempo</TD>
                <TD>12 meses</TD>
              </tr>
            </tbody>
          </TableWrapper>

          <H3>Analítica</H3>
          <p className="font-medium">Requiere consentimiento. Desactivadas por defecto.</p>
          <p>
            Estas cookies nos permiten medir cómo los usuarios interactúan con LagomPlan
            — incluyendo qué guías se leen, los flujos de navegación y las fuentes de
            tráfico. Esta información orienta las decisiones sobre el producto y la mejora
            de contenidos.
          </p>
          <p>
            Los datos recopilados están sujetos a las políticas de privacidad del proveedor
            de analítica. Las direcciones IP son recopiladas por el proveedor y pueden
            utilizarse para inferir la ubicación geográfica aproximada. Los datos están
            seudonimizados — no pueden identificarle directamente sin información adicional
            en poder del proveedor.
          </p>
          <TableWrapper>
            <THead>
              <TH>Proveedor</TH>
              <TH>Finalidad</TH>
              <TH>Duración</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Google Analytics</TD>
                <TD>Páginas vistas, sesiones, atribución de tráfico</TD>
                <TD>Hasta 2 años</TD>
              </tr>
            </tbody>
          </TableWrapper>

          <H3>Marketing y seguimiento de afiliados</H3>
          <p className="font-medium">Requiere consentimiento. Desactivadas por defecto.</p>
          <p>
            LagomPlan genera ingresos a través de asociaciones de afiliados con proveedores
            de viajes como Booking.com. Cuando hace clic en un enlace externo hacia un
            socio y completa una reserva, una cookie establecida por ese socio atribuye la
            referencia a LagomPlan y genera el pago de una comisión para nosotros.
          </p>
          <p>
            Si rechaza esta categoría, los enlaces externos seguirán funcionando con
            normalidad — usted no se verá perjudicado en ningún sentido — pero LagomPlan
            no recibirá atribución de comisión por su reserva.
          </p>
          <TableWrapper>
            <THead>
              <TH>Proveedor</TH>
              <TH>Finalidad</TH>
              <TH>Duración</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Booking.com</TD>
                <TD>Atribución de referencia de afiliado</TD>
                <TD>Hasta 30 días</TD>
              </tr>
              <tr>
                <TD>Otras redes de afiliados</TD>
                <TD>Seguimiento de referencia y atribución de comisión</TD>
                <TD>Varía según proveedor</TD>
              </tr>
              <tr>
                <TD>Plataformas de retargeting (futuras)</TD>
                <TD>Publicidad basada en el comportamiento de navegación</TD>
                <TD>Hasta 90 días</TD>
              </tr>
            </tbody>
          </TableWrapper>

          <H3>Preferencias</H3>
          <p className="font-medium">Requiere consentimiento. Desactivadas por defecto.</p>
          <p>
            Estas cookies recuerdan las elecciones que realiza en LagomPlan — como su
            idioma preferido — para que no tenga que seleccionarlas en cada visita.
          </p>
          <TableWrapper>
            <THead>
              <TH>Cookie</TH>
              <TH>Finalidad</TH>
              <TH>Duración</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Idioma</TD>
                <TD>Almacena el idioma seleccionado (p. ej. español / inglés)</TD>
                <TD>12 meses</TD>
              </tr>
              <tr>
                <TD>Preferencias de interfaz</TD>
                <TD>Guarda ajustes de visualización o filtros</TD>
                <TD>30 días</TD>
              </tr>
            </tbody>
          </TableWrapper>

          {/* 4 */}
          <H2>4. Cookies de terceros</H2>
          <p>
            Los siguientes proveedores externos pueden establecer cookies en su dispositivo
            cuando utiliza LagomPlan, en función de sus preferencias de consentimiento.
            LagomPlan no controla cómo estos terceros recopilan, utilizan o conservan los
            datos más allá de lo que ellos mismos divulgan en sus políticas de privacidad.
          </p>
          <TableWrapper>
            <THead>
              <TH>Proveedor</TH>
              <TH>Categoría</TH>
              <TH>Política de privacidad</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Google Analytics</TD>
                <TD>Analítica</TD>
                <TD>
                  <ExternalLink href="https://policies.google.com/privacy">
                    policies.google.com/privacy
                  </ExternalLink>
                </TD>
              </tr>
              <tr>
                <TD>Booking.com</TD>
                <TD>Seguimiento de afiliados</TD>
                <TD>
                  <ExternalLink href="https://www.booking.com/content/privacy.html">
                    booking.com/content/privacy.html
                  </ExternalLink>
                </TD>
              </tr>
              <tr>
                <TD>Otros socios afiliados</TD>
                <TD>Seguimiento de afiliados</TD>
                <TD>Se comunicarán conforme se establezcan las relaciones</TD>
              </tr>
            </tbody>
          </TableWrapper>
          <p>
            No permitimos que los proveedores externos utilicen los datos recopilados a
            través de LagomPlan para sus propios fines publicitarios o de elaboración de
            perfiles sin divulgación explícita en esta política.
          </p>

          {/* 5 */}
          <H2>5. Divulgación de relaciones de afiliado</H2>
          <p>
            LagomPlan recomienda hoteles, experiencias y servicios de viaje basándose
            exclusivamente en criterios editoriales. No aceptamos pagos para destacar o
            posicionar proveedores específicos. Algunas recomendaciones incluyen enlaces
            de afiliado — si hace clic en uno y completa una reserva, LagomPlan recibe
            una comisión del proveedor sin coste adicional para usted.
          </p>
          <p>
            El seguimiento de afiliados requiere una cookie o un parámetro de URL para
            funcionar. Si rechaza la categoría de Marketing y Seguimiento de Afiliados,
            sus reservas a través de nuestros enlaces no se verán afectadas, pero LagomPlan
            no recibirá comisión por la referencia. Divulgamos esto porque creemos que
            usted tiene derecho a saber cómo se financia nuestra plataforma y qué implica
            en la práctica rechazar el seguimiento.
          </p>

          {/* 6 */}
          <H2>6. Base legal (RGPD)</H2>
          <p>
            Para usuarios en el Espacio Económico Europeo y el Reino Unido, se aplican
            las siguientes bases legales en virtud del Reglamento (UE) 2016/679 (RGPD):
          </p>
          <TableWrapper>
            <THead>
              <TH>Categoría de cookie</TH>
              <TH>Base legal</TH>
              <TH>Artículo RGPD</TH>
            </THead>
            <tbody>
              <tr>
                <TD>Estrictamente necesarias</TD>
                <TD>Interés legítimo / ejecución de un contrato</TD>
                <TD>Art. 6(1)(b) y 6(1)(f)</TD>
              </tr>
              <tr>
                <TD>Analítica</TD>
                <TD>Consentimiento</TD>
                <TD>Art. 6(1)(a)</TD>
              </tr>
              <tr>
                <TD>Marketing y seguimiento de afiliados</TD>
                <TD>Consentimiento</TD>
                <TD>Art. 6(1)(a)</TD>
              </tr>
              <tr>
                <TD>Preferencias</TD>
                <TD>Consentimiento</TD>
                <TD>Art. 6(1)(a)</TD>
              </tr>
            </tbody>
          </TableWrapper>
          <p>
            El consentimiento se obtiene a través de nuestro banner de cookies antes de
            que se active cualquier cookie no esencial. Puede retirar su consentimiento
            en cualquier momento sin penalización. La retirada no afecta a la licitud del
            tratamiento realizado antes de la misma.
          </p>
          <p>
            Para usuarios en California (EE.UU.), puede optar por no participar en la
            venta o el intercambio de datos personales según lo definido en la CCPA/CPRA
            rechazando las categorías de Marketing y Seguimiento de Afiliados y Analítica.
            No se ofrece ningún incentivo económico a cambio del consentimiento.
          </p>

          {/* 7 */}
          <H2>7. Gestión y retirada del consentimiento</H2>
          <p>Puede revisar y cambiar sus preferencias de cookies en cualquier momento.</p>
          <H3>Panel de configuración de cookies</H3>
          <p>
            Un enlace persistente de <span className="font-medium">Política de cookies</span>{' '}
            está disponible en el pie de página de todas las páginas de LagomPlan. Al hacer
            clic, se abre el panel de preferencias donde puede activar o desactivar categorías
            individuales y guardar sus elecciones. Los cambios tienen efecto inmediato para
            la nueva actividad de cookies.
          </p>
          <H3>Controles a nivel de navegador</H3>
          <p>
            Puede bloquear o eliminar cookies a través de la configuración de su navegador.
            Tenga en cuenta que bloquear las cookies estrictamente necesarias puede impedir
            que algunas partes de la plataforma funcionen correctamente.
          </p>
          <UL>
            <li><span className="font-medium">Chrome:</span> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
            <li><span className="font-medium">Firefox:</span> Ajustes → Privacidad y Seguridad → Cookies y datos del sitio</li>
            <li><span className="font-medium">Safari:</span> Preferencias → Privacidad → Gestionar datos de sitios web</li>
            <li><span className="font-medium">Edge:</span> Configuración → Cookies y permisos de sitio</li>
          </UL>
          <H3>Exclusión voluntaria de terceros</H3>
          <UL>
            <li>
              Google Analytics:{' '}
              <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                tools.google.com/dlpage/gaoptout
              </ExternalLink>
            </li>
            <li>
              Booking.com:{' '}
              <ExternalLink href="https://www.booking.com/content/privacy.html">
                booking.com/content/privacy.html
              </ExternalLink>
            </li>
          </UL>
          <H3>Nuevo consentimiento</H3>
          <p>
            Sus elecciones de consentimiento se almacenan durante 12 meses. Transcurrido
            este período, o si borra sus cookies, el banner reaparecerá y solicitará una
            nueva decisión. Si realizamos cambios materiales en nuestras prácticas de
            cookies, lo trataremos como un nuevo evento de consentimiento independientemente
            de la marca de tiempo almacenada.
          </p>

          {/* 8 */}
          <H2>8. Transferencias internacionales de datos</H2>
          <p>
            LagomPlan opera desde México. Algunos proveedores externos — incluido Google —
            están radicados en los Estados Unidos y pueden tratar datos allí. Los Estados
            Unidos no disponen de una decisión de adecuación general de la Comisión Europea
            que cubra todas las transferencias.
          </p>
          <p>
            Cuando los datos personales se transfieren fuera del EEE a un país sin decisión
            de adecuación, nos basamos en:
          </p>
          <UL>
            <li>
              <span className="font-medium">Cláusulas Contractuales Tipo (CCT)</span>{' '}
              aprobadas por la Comisión Europea (Decisión 2021/914), que imponen
              obligaciones vinculantes de protección de datos al destinatario
            </li>
            <li>
              <span className="font-medium">Decisiones de adecuación</span> cuando resulten
              aplicables (p. ej. Marco de Privacidad de Datos UE-EE.UU. cuando el
              destinatario esté certificado)
            </li>
          </UL>
          <p>
            Puede solicitar una copia del mecanismo de transferencia aplicable
            contactándonos en la dirección indicada en la Sección 9.
          </p>

          {/* 9 */}
          <H2>9. Contacto</H2>
          <p>
            Para consultas o solicitudes relacionadas con esta Política de Cookies o con
            sus datos personales:
          </p>
          <ul className="list-none pl-0 space-y-1">
            <li><span className="font-medium">LagomPlan</span></li>
            <li>
              <span className="font-medium">Correo electrónico:</span>{' '}
              <MailLink address="privacy@lagomplan.com" />
            </li>
            <li><span className="font-medium">Domicilio:</span> Ciudad de México, México</li>
          </ul>
          <p className="mt-4">
            Para presentar una queja ante una autoridad de protección de datos, contacte
            con la autoridad supervisora de su país. Los residentes en la UE pueden
            encontrar su autoridad en{' '}
            <ExternalLink href="https://edpb.europa.eu">edpb.europa.eu</ExternalLink>.
            Los residentes en el Reino Unido pueden contactar con la ICO en{' '}
            <ExternalLink href="https://ico.org.uk">ico.org.uk</ExternalLink>.
          </p>

          <p className="mt-12 text-sm text-neutral-500">
            LagomPlan &nbsp;•&nbsp; Política de Cookies v1.0 &nbsp;•&nbsp; 22 de abril de 2026
          </p>

        </div>
      </div>
    </section>
  )
}
