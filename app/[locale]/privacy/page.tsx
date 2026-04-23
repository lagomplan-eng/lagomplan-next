/**
 * app/[locale]/privacy/page.tsx
 * Route ES: /es/privacidad   Route EN: /en/privacy
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
    title:      locale === 'es' ? 'Política de Privacidad' : 'Privacy Policy',
    alternates: buildAlternates('privacy'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  if (locale === 'en') {
    return (
      <section className="bg-[#F7F4EF] min-h-screen pt-[120px]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D37] mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-neutral-500 mb-10">March 5, 2026</p>
          <div className="text-neutral-700 leading-relaxed text-base space-y-4">
            <p>
              We are working on the English version of our privacy policy. If you have
              any questions, please contact us at{' '}
              <a href="mailto:contact@elenaferre.com" className="underline hover:text-[#1F3D37]">
                contact@elenaferre.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#F7F4EF] min-h-screen pt-[120px]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D37] mb-2">
          Política de Privacidad
        </h1>
        <p className="text-sm text-neutral-500 mb-10">5 de marzo de 2026</p>

        <div className="text-neutral-700 leading-relaxed text-base space-y-4">

          <p className="text-sm text-neutral-500 italic">
            Aplicable a usuarios en México, América Latina y a nivel global
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">1. Introducción</h2>
          <p>
            Lagomplan (en adelante, "Lagomplan", "nosotros", "nuestro" o "la Plataforma")
            es un servicio de planificación de viajes asistido por inteligencia artificial,
            accesible mediante la plataforma web ubicada en www.lagomplan.com (o el dominio
            oficial que se encuentre vigente). Lagomplan es operado por María Elena Ferré
            Lagunes y María del Pilar Marroquín Calderón, personas físicas con actividad
            empresarial registradas conforme a las leyes de los Estados Unidos Mexicanos,
            con domicilio en Ciudad de México, México.
          </p>
          <p>
            La presente Política de Privacidad (en adelante, la "Política") describe de
            manera clara, transparente y en lenguaje accesible cómo recopilamos, usamos,
            almacenamos, compartimos y protegemos la información personal de nuestros
            usuarios, de conformidad con:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>La Ley Federal de Protección de Datos Personales en Posesión de los
                Particulares (LFPDPPP) y su Reglamento (México).</li>
            <li>Los Lineamientos del Aviso de Privacidad publicados en el Diario
                Oficial de la Federación.</li>
            <li>La Ley N.º 25.326 de Protección de los Datos Personales (Argentina).</li>
            <li>La Ley 1581 de 2012 y el Decreto 1377 de 2013 (Colombia).</li>
            <li>El Reglamento General de Protección de Datos (RGPD / GDPR) de la Unión
                Europea, en la medida en que resulte aplicable a usuarios residentes en el
                Espacio Económico Europeo.</li>
            <li>La Children's Online Privacy Protection Act (COPPA) y demás normativas
                aplicables a menores de edad en las jurisdicciones donde operamos.</li>
          </ul>
          <p>
            Al acceder o utilizar Lagomplan, usted declara haber leído, comprendido y
            aceptado esta Política en su totalidad. Si no está de acuerdo con alguno de
            los términos aquí establecidos, le pedimos que se abstenga de utilizar la
            Plataforma.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">2. Datos Personales que Recopilamos</h2>
          <p>
            Lagomplan recopila distintas categorías de datos personales dependiendo de
            cómo el usuario interactúa con la Plataforma.
          </p>

          <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">2.1 Datos Proporcionados Directamente por el Usuario</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre completo y nombre de usuario (nickname).</li>
            <li>Dirección de correo electrónico.</li>
            <li>Contraseña (almacenada en formato hash irreversible; nunca en texto plano).</li>
            <li>Número de teléfono (opcional, para autenticación de dos factores).</li>
            <li>Fecha de nacimiento (para verificación de edad y personalización).</li>
            <li>Preferencias de viaje (destinos de interés, tipo de alojamiento, presupuesto
                aproximado, restricciones alimentarias, accesibilidad, etc.).</li>
            <li>Contenido generado por el usuario: itinerarios guardados, listas de deseos
                (wishlists), comentarios y reseñas.</li>
            <li>Datos de facturación: nombre del titular, últimos cuatro dígitos de la
                tarjeta, dirección de facturación y datos fiscales (RFC o equivalente).
                Los datos completos de tarjeta son procesados exclusivamente por nuestro
                proveedor de pagos certificado PCI-DSS y no son almacenados en nuestros
                servidores.</li>
          </ul>

          <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">2.2 Datos Recopilados de Forma Automática</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Dirección IP y datos de geolocalización aproximada (país, ciudad).</li>
            <li>Tipo de dispositivo, sistema operativo y versión del navegador (User-Agent).</li>
            <li>Páginas visitadas, duración de la sesión, clics y flujos de navegación.</li>
            <li>Identificadores de cookies y tecnologías de rastreo similares.</li>
            <li>Registros de errores y datos de diagnóstico técnico.</li>
          </ul>

          <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">2.3 Datos Obtenidos de Terceros</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Datos de perfil básico (nombre, correo, foto de perfil) cuando el usuario
                inicia sesión mediante Google OAuth u otro proveedor de identidad habilitado.</li>
            <li>Datos de transacción confirmada proporcionados por procesadores de pago
                (Stripe, Conekta, MercadoPago u otros).</li>
          </ul>

          <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">2.4 Datos de Menores de Edad</h3>
          <p>
            Lagomplan permite el registro de usuarios a partir de los 13 (trece) años de
            edad, en cumplimiento de la COPPA y las disposiciones legales aplicables. Para
            usuarios entre 13 y 17 años:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Se requerirá el consentimiento verificable de un padre, tutor o
                representante legal antes de completar el registro.</li>
            <li>No se recopilará información sensible adicional más allá de la
                estrictamente necesaria.</li>
            <li>Los menores no podrán publicar reseñas públicas ni compartir itinerarios
                sin autorización del adulto responsable.</li>
            <li>Los datos de menores no serán utilizados para fines publicitarios
                personalizados.</li>
          </ul>
          <p>
            Si tenemos conocimiento de que hemos recopilado datos de un menor sin el
            consentimiento apropiado, procederemos a su eliminación inmediata.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">3. Finalidades del Tratamiento de Datos</h2>

          <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">3.1 Finalidades Primarias</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Crear y administrar su cuenta de usuario en Lagomplan.</li>
            <li>Generar itinerarios de viaje personalizados mediante el motor de
                inteligencia artificial integrado.</li>
            <li>Procesar suscripciones y pagos.</li>
            <li>Enviar comunicaciones transaccionales: confirmaciones, cambios de
                contraseña, facturas y recibos.</li>
            <li>Brindar soporte técnico y atención al cliente.</li>
            <li>Garantizar la seguridad de la Plataforma y prevenir fraudes.</li>
            <li>Cumplir con obligaciones legales, fiscales y regulatorias.</li>
          </ul>

          <h3 className="mt-6 mb-3 font-semibold text-[#1F3D37]">3.2 Finalidades Secundarias (opcionales; requieren consentimiento)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Enviarle comunicaciones de marketing, novedades y promociones.</li>
            <li>Realizar estudios estadísticos sobre tendencias de viaje,
                de forma anonimizada.</li>
            <li>Mejorar y entrenar nuestros modelos de IA con datos de uso,
                previa anonimización.</li>
            <li>Mostrar publicidad personalizada, salvo que usted opte por no
                participar (opt-out).</li>
          </ul>
          <p>
            Puede revocar su consentimiento para las finalidades secundarias en cualquier
            momento desde "Configuración de Privacidad" en su cuenta o escribiendo a{' '}
            <a href="mailto:contact@elenaferre.com" className="underline hover:text-[#1F3D37]">
              contact@elenaferre.com
            </a>.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">4. Base Legal del Tratamiento</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium">Ejecución de un contrato:</span> cuando el
                tratamiento es necesario para prestar el servicio solicitado.</li>
            <li><span className="font-medium">Consentimiento:</span> para finalidades
                secundarias, marketing y cookies no esenciales.</li>
            <li><span className="font-medium">Obligación legal:</span> para el
                cumplimiento de requerimientos fiscales y regulatorios.</li>
            <li><span className="font-medium">Interés legítimo:</span> para la prevención
                del fraude, la seguridad de la red y el análisis estadístico anonimizado.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">5. Transferencias y Comunicación de Datos a Terceros</h2>
          <p>
            Lagomplan no vende sus datos personales. Sin embargo, puede compartirlos con
            las siguientes categorías de destinatarios, bajo estrictas condiciones
            contractuales:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proveedores de servicios en la nube e infraestructura (ej. Amazon Web
                Services, Google Cloud Platform).</li>
            <li>Procesadores de pago (ej. Stripe, Conekta, MercadoPago) con
                certificación PCI-DSS.</li>
            <li>Proveedores de analítica y medición del rendimiento (ej. Google
                Analytics, Mixpanel), de forma anonimizada cuando sea posible.</li>
            <li>Proveedores de correo electrónico transaccional (ej. SendGrid, Mailgun).</li>
            <li>Proveedores de atención al cliente (ej. Zendesk, Intercom).</li>
            <li>Autoridades gubernamentales, judiciales o regulatorias, cuando sea
                exigido por ley.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">6. Plazos de Conservación de los Datos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium">Datos de cuenta activa:</span> durante toda
                la vigencia de su relación con Lagomplan.</li>
            <li><span className="font-medium">Datos de cuenta cancelada:</span> hasta 5
                años, en cumplimiento de obligaciones fiscales y contables.</li>
            <li><span className="font-medium">Datos de menores de edad:</span> se
                eliminarán dentro de los 30 días naturales siguientes a la solicitud del
                tutor o a la detección de la falta de consentimiento parental.</li>
            <li><span className="font-medium">Datos de navegación y cookies:</span> máximo
                13 meses.</li>
            <li><span className="font-medium">Registros de seguridad y auditoría:</span>
                hasta 2 años.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">7. Derechos de los Usuarios (ARCO y Adicionales)</h2>
          <p>De conformidad con la LFPDPPP y demás normativas aplicables, usted tiene derecho a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium">Acceso:</span> conocer qué datos personales
                tratamos sobre usted y con qué finalidad.</li>
            <li><span className="font-medium">Rectificación:</span> corregir datos
                inexactos, incompletos o desactualizados.</li>
            <li><span className="font-medium">Cancelación (Supresión):</span> solicitar la
                eliminación de sus datos cuando ya no sean necesarios.</li>
            <li><span className="font-medium">Oposición:</span> oponerse al tratamiento
                para finalidades específicas, en particular marketing directo.</li>
            <li><span className="font-medium">Portabilidad</span> (usuarios en UE/EEE):
                recibir sus datos en formato estructurado y legible por máquina.</li>
            <li><span className="font-medium">Limitación del tratamiento:</span> solicitar
                que el tratamiento quede restringido mientras se resuelve una reclamación.</li>
            <li><span className="font-medium">Revocación del consentimiento:</span> en
                cualquier momento, sin afectar la licitud del tratamiento previo.</li>
          </ul>
          <p>
            Podrá ejercer sus derechos mediante solicitud dirigida a{' '}
            <a href="mailto:privacidad@lagomplan.com" className="underline hover:text-[#1F3D37]">
              privacidad@lagomplan.com
            </a>{' '}
            o desde "Mi cuenta &gt; Privacidad". Atenderemos su solicitud dentro de los
            20 días hábiles siguientes a su recepción.
          </p>
          <p>
            Si considera que su solicitud no fue debidamente atendida, puede presentar
            una queja ante el INAI (
            <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1F3D37]">
              www.inai.org.mx
            </a>
            ) o ante la autoridad de control competente en su país de residencia.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">8. Cookies y Tecnologías de Rastreo</h2>
          <p>Lagomplan utiliza las siguientes categorías de cookies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium">Cookies estrictamente necesarias:</span>
                esenciales para el funcionamiento (gestión de sesión, seguridad CSRF,
                preferencias de idioma). No requieren consentimiento.</li>
            <li><span className="font-medium">Cookies de analítica y rendimiento:</span>
                comprenden cómo los usuarios interactúan con la Plataforma. Datos
                pseudonimizados. Requieren consentimiento.</li>
            <li><span className="font-medium">Cookies de funcionalidad:</span> recuerdan
                preferencias (idioma, moneda, favoritos). Requieren consentimiento.</li>
            <li><span className="font-medium">Cookies de marketing y publicidad:</span>
                muestran publicidad relevante. Pueden compartir datos con redes
                publicitarias. Requieren consentimiento explícito.</li>
          </ul>
          <p>
            Puede modificar sus preferencias en cualquier momento desde el enlace
            "Configuración de Cookies" en el pie de página.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">9. Medidas de Seguridad</h2>
          <p>Lagomplan implementa las siguientes medidas para proteger sus datos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cifrado en tránsito mediante TLS 1.2 o superior (HTTPS).</li>
            <li>Cifrado en reposo de bases de datos con información sensible (AES-256).</li>
            <li>Almacenamiento de contraseñas exclusivamente en formato hash
                (bcrypt o Argon2).</li>
            <li>Autenticación de dos factores (2FA) disponible para todas las cuentas.</li>
            <li>Control de acceso basado en roles (RBAC) para el personal interno.</li>
            <li>Revisiones periódicas de seguridad, pentesting y auditorías.</li>
          </ul>
          <p>
            En caso de brecha de seguridad que represente un riesgo para sus derechos,
            se lo notificaremos en un plazo máximo de 72 horas.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">10. Inteligencia Artificial y Toma de Decisiones Automatizada</h2>
          <p>
            El motor de IA de Lagomplan utiliza sus preferencias e historial de búsqueda
            para generar recomendaciones personalizadas. Ninguna decisión con efectos
            jurídicos o significativos sobre usted se adoptará de forma exclusivamente
            automatizada sin intervención humana, salvo que sea necesario para la
            ejecución del contrato o con su consentimiento explícito.
          </p>
          <p>
            Los datos utilizados para entrenar nuestros modelos serán previamente
            anonimizados o pseudonimizados. Puede solicitar revisión humana de cualquier
            decisión automatizada escribiendo a{' '}
            <a href="mailto:privacidad@lagomplan.com" className="underline hover:text-[#1F3D37]">
              privacidad@lagomplan.com
            </a>.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">11. Política Específica para Menores de Edad</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>La verificación de edad se realiza durante el registro mediante la
                fecha de nacimiento declarada y, para usuarios entre 13 y 17 años,
                mediante confirmación del representante legal.</li>
            <li>No realizamos perfilado publicitario ni mostramos publicidad conductual
                a usuarios menores de 18 años.</li>
            <li>No compartimos datos de menores con terceros para fines de marketing.</li>
            <li>El representante legal puede solicitar acceso, rectificación o eliminación
                de los datos del menor en cualquier momento.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">12. Procesamiento de Pagos</h2>
          <p>
            Lagomplan ofrecerá próximamente planes de suscripción de pago. El procesamiento
            será realizado por proveedores certificados PCI-DSS. Lagomplan no almacena
            números completos de tarjeta, CVV/CVC ni PINs. Únicamente se almacenarán
            tokens de pago, los últimos cuatro dígitos del instrumento de pago y los datos
            de facturación necesarios para el SAT.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">13. Modificaciones a la Política de Privacidad</h2>
          <p>
            Cuando realicemos cambios materiales a esta Política:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publicaremos la versión actualizada en www.lagomplan.com/privacidad
                con la nueva fecha de vigencia.</li>
            <li>Le notificaremos por correo electrónico y/o mediante un aviso en la
                Plataforma con al menos 15 días de antelación.</li>
            <li>Si los cambios requieren nuevo consentimiento, lo solicitaremos antes
                de continuar el tratamiento.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">14. Ley Aplicable y Jurisdicción</h2>
          <p>
            La presente Política se rige conforme a las leyes de los Estados Unidos
            Mexicanos. Para la resolución de controversias, las partes se someten a los
            tribunales competentes de la Ciudad de México. Para usuarios en la Unión
            Europea, esto no limitará su derecho a recurrir ante la autoridad de control
            de su Estado miembro.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">15. Contacto y Responsable de Protección de Datos</h2>
          <p>
            Para consultas, ejercicio de derechos ARCO o reporte de incidentes:
          </p>
          <ul className="list-none pl-0 space-y-1">
            <li>
              <span className="font-medium">Correo electrónico:</span>{' '}
              <a href="mailto:contact@elenaferre.com" className="underline hover:text-[#1F3D37]">
                contact@elenaferre.com
              </a>
            </li>
            <li><span className="font-medium">Domicilio postal:</span> Ciudad de México, México</li>
          </ul>

          <p className="mt-12 text-sm text-neutral-500">
            Lagomplan &nbsp;•&nbsp; Versión 1.0 &nbsp;•&nbsp; 5 de marzo de 2026
            <br />
            Este documento ha sido redactado conforme a la LFPDPPP, RGPD y normativas
            latinoamericanas aplicables.
          </p>

        </div>
      </div>
    </section>
  )
}
