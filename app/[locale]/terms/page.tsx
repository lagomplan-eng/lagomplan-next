/**
 * app/[locale]/terms/page.tsx
 * Route ES: /es/terminos   Route EN: /en/terms
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
    title:      locale === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions',
    alternates: buildAlternates('terms'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  if (locale === 'en') {
    return (
      <section className="bg-[#F7F4EF] min-h-screen pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D37] mb-2">
            Terms and Conditions of Use
          </h1>
          <p className="text-sm text-neutral-500 mb-10">March 5, 2026</p>
          <div className="text-neutral-700 leading-relaxed text-base space-y-4">
            <p>
              These Terms and Conditions are currently available in Spanish. An English
              translation is coming soon. If you have any questions, please contact us at{' '}
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
    <section className="bg-[#F7F4EF] min-h-screen pt-[100px]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D37] mb-2">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-sm text-neutral-500 mb-10">5 de marzo de 2026</p>

        <div className="text-neutral-700 leading-relaxed text-base space-y-4">

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar Lagomplan (en adelante, "la Plataforma"), ubicada en{' '}
            <span className="font-medium">www.lagomplan.com</span>, usted acepta quedar
            vinculado por los presentes Términos y Condiciones de Uso (en adelante,
            "los Términos"). Si no está de acuerdo con alguno de estos Términos, por
            favor absténgase de utilizar la Plataforma.
          </p>
          <p>
            Lagomplan es operado por María Elena Ferré Lagunes y María del Pilar Marroquín
            Calderón, personas físicas con actividad empresarial registradas conforme a
            las leyes de los Estados Unidos Mexicanos, con domicilio en Ciudad de México,
            México (en adelante, "nosotros", "nuestro" o "Lagomplan").
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">2. Descripción del Servicio</h2>
          <p>
            Lagomplan es una plataforma de planificación de viajes asistida por inteligencia
            artificial que permite a los usuarios generar itinerarios personalizados,
            explorar guías de destinos, descubrir opciones de alojamiento y organizar
            sus viajes de manera eficiente.
          </p>
          <p>
            El servicio incluye funcionalidades gratuitas y, en el futuro, planes de
            suscripción de pago. La disponibilidad de funcionalidades específicas puede
            variar según el plan contratado.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">3. Registro y Cuenta de Usuario</h2>
          <p>
            Para acceder a determinadas funcionalidades de la Plataforma, será necesario
            crear una cuenta de usuario. Al registrarse, usted se compromete a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proporcionar información veraz, completa y actualizada.</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            <li>Notificarnos de inmediato ante cualquier uso no autorizado de su cuenta.</li>
            <li>Ser responsable de todas las actividades realizadas desde su cuenta.</li>
          </ul>
          <p>
            Lagomplan permite el registro de usuarios a partir de los 13 (trece) años de
            edad. Para usuarios entre 13 y 17 años, se requiere el consentimiento
            verificable de un padre, tutor o representante legal.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">4. Uso Aceptable de la Plataforma</h2>
          <p>
            Usted se compromete a utilizar la Plataforma exclusivamente para fines lícitos
            y de conformidad con estos Términos. Queda expresamente prohibido:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar la Plataforma para fines ilegales o no autorizados.</li>
            <li>Intentar acceder sin autorización a sistemas, datos o cuentas ajenas.</li>
            <li>Publicar contenido difamatorio, obsceno, fraudulento o que infrinja
                derechos de terceros.</li>
            <li>Utilizar robots, scrapers u otros medios automatizados para extraer
                contenido de la Plataforma sin autorización previa por escrito.</li>
            <li>Interferir con la seguridad, integridad o rendimiento de la Plataforma.</li>
            <li>Suplantar la identidad de otra persona o entidad.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">5. Propiedad Intelectual</h2>
          <p>
            Todos los contenidos de la Plataforma — incluyendo, sin limitación, textos,
            diseños, logotipos, imágenes, itinerarios generados, guías editoriales y
            código fuente — son propiedad de Lagomplan o de sus licenciantes y están
            protegidos por las leyes de propiedad intelectual aplicables en México y a
            nivel internacional.
          </p>
          <p>
            Se concede al usuario una licencia limitada, no exclusiva, intransferible y
            revocable para acceder y hacer uso personal de la Plataforma. Queda prohibida
            la reproducción, distribución, modificación o explotación comercial de
            cualquier contenido sin autorización previa y por escrito de Lagomplan.
          </p>
          <p>
            Los itinerarios generados por la IA de Lagomplan son para uso personal del
            usuario. No podrán ser revendidos, publicados en otros medios ni utilizados
            con fines comerciales sin autorización expresa.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">6. Contenido Generado por el Usuario</h2>
          <p>
            Al publicar reseñas, comentarios u otro contenido en la Plataforma, usted
            otorga a Lagomplan una licencia no exclusiva, mundial, libre de regalías y
            sublicenciable para usar, reproducir, modificar, adaptar, publicar y mostrar
            dicho contenido en el contexto de la prestación del servicio.
          </p>
          <p>
            Usted declara y garantiza que es titular o cuenta con los derechos necesarios
            sobre el contenido que publica, y que dicho contenido no infringe derechos de
            terceros ni legislación aplicable.
          </p>
          <p>
            Lagomplan se reserva el derecho de retirar cualquier contenido que, a su
            criterio razonable, incumpla estos Términos o resulte inapropiado.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">7. Planes de Pago y Facturación</h2>
          <p>
            Lagomplan ofrecerá próximamente planes de suscripción de pago. Cuando estén
            disponibles, los siguientes términos serán aplicables:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Los precios se publicarán en la Plataforma e incluirán los impuestos
                aplicables conforme a la legislación mexicana.</li>
            <li>El pago se realizará de forma anticipada por el período contratado
                (mensual o anual).</li>
            <li>Las suscripciones se renovarán automáticamente salvo cancelación previa.</li>
            <li>Los reembolsos se procesarán conforme a la política de reembolsos
                vigente al momento de la contratación.</li>
            <li>Lagomplan se reserva el derecho de modificar los precios con un
                preaviso mínimo de 30 días.</li>
          </ul>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">8. Limitación de Responsabilidad</h2>
          <p>
            La Plataforma se proporciona "tal como está" y "según disponibilidad".
            Lagomplan no garantiza que la Plataforma sea ininterrumpida, libre de errores
            o completamente segura.
          </p>
          <p>
            Los itinerarios, recomendaciones de alojamiento, estimaciones de presupuesto
            y demás contenidos generados por la inteligencia artificial de Lagomplan
            tienen carácter meramente orientativo. Lagomplan no asume responsabilidad
            alguna por decisiones de viaje tomadas con base en dichos contenidos.
          </p>
          <p>
            En la máxima medida permitida por la ley aplicable, Lagomplan no será
            responsable por daños indirectos, incidentales, especiales, consecuentes o
            punitivos derivados del uso o imposibilidad de uso de la Plataforma.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">9. Modificaciones al Servicio y a los Términos</h2>
          <p>
            Lagomplan se reserva el derecho de modificar, suspender o interrumpir,
            temporal o permanentemente, cualquier parte de la Plataforma, con o sin
            previo aviso.
          </p>
          <p>
            Asimismo, podemos actualizar estos Términos en cualquier momento. Cuando los
            cambios sean materiales, lo notificaremos mediante un aviso en la Plataforma
            o por correo electrónico con al menos 15 (quince) días de antelación. El uso
            continuado de la Plataforma tras la entrada en vigor de los nuevos Términos
            constituirá su aceptación.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">10. Privacidad y Protección de Datos</h2>
          <p>
            El tratamiento de sus datos personales se rige por nuestra{' '}
            <a href="/es/privacidad" className="underline hover:text-[#1F3D37]">
              Política de Privacidad
            </a>
            , que forma parte integrante de estos Términos. Le recomendamos leerla
            detenidamente.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">11. Cancelación de Cuenta</h2>
          <p>
            Usted puede cancelar su cuenta en cualquier momento desde la sección
            "Mi cuenta" de la Plataforma o escribiendo a{' '}
            <a href="mailto:contact@elenaferre.com" className="underline hover:text-[#1F3D37]">
              contact@elenaferre.com
            </a>
            . Tras la cancelación, sus datos serán tratados conforme a lo establecido
            en nuestra Política de Privacidad.
          </p>
          <p>
            Lagomplan se reserva el derecho de suspender o cancelar cuentas que
            incumplan estos Términos, con o sin previo aviso, según la gravedad de la
            infracción.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">12. Ley Aplicable y Jurisdicción</h2>
          <p>
            Los presentes Términos se rigen e interpretan de conformidad con las leyes
            de los Estados Unidos Mexicanos. Para la resolución de cualquier controversia
            derivada de estos Términos, las partes se someten expresamente a la
            jurisdicción de los tribunales competentes de la Ciudad de México, renunciando
            a cualquier otro fuero que pudiera corresponderles.
          </p>

          <h2 className="mt-10 mb-4 font-semibold text-[#1F3D37] text-xl">13. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con estos Términos, puede contactarnos en:
          </p>
          <ul className="list-none pl-0 space-y-1">
            <li>
              <span className="font-medium">Correo electrónico:</span>{' '}
              <a href="mailto:contact@elenaferre.com" className="underline hover:text-[#1F3D37]">
                contact@elenaferre.com
              </a>
            </li>
            <li><span className="font-medium">Domicilio:</span> Ciudad de México, México</li>
          </ul>

          <p className="mt-12 text-sm text-neutral-500">
            Lagomplan &nbsp;•&nbsp; Versión 1.0 &nbsp;•&nbsp; 5 de marzo de 2026
          </p>

        </div>
      </div>
    </section>
  )
}
