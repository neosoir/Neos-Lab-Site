import Header from '../componets/Header';
import Footer from '../componets/Footer';
import './LegalPages.css';

function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-content">
          <h1>POLÍTICA DE PRIVACIDAD</h1>
          <p className="last-update">Última actualización: 20 de febrero de 2026</p>

          <section>
            <p>
              En Neos Lab valoramos la privacidad de nuestros usuarios, clientes y visitantes. 
              Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y 
              protegemos la información personal en relación con nuestros servicios de 
              automatización, mensajería y asistencia técnica a través de plataformas como 
              WhatsApp Business API, Meta Developers, n8n y otros canales digitales.
            </p>
          </section>

          <section>
            <h3>1. Información que recopilamos</h3>
            <p>Podemos recopilar la siguiente información:</p>
            <ul>
              <li>Datos de contacto: nombre, correo electrónico, número de teléfono</li>
              <li>Información de negocio: nombre de la empresa, identificadores de Meta Business Manager, páginas de Facebook, números de WhatsApp</li>
              <li>Datos técnicos: tokens de acceso, IDs de aplicaciones, configuraciones de webhook, logs de automatización</li>
              <li>Información de uso: métricas de interacción, tasas de entrega, errores técnicos</li>
            </ul>
          </section>

          <section>
            <h3>2. Cómo usamos la información</h3>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Configurar y operar flujos automatizados en plataformas como WhatsApp, Facebook e Instagram</li>
              <li>Gestionar integraciones técnicas con Meta APIs y herramientas como n8n</li>
              <li>Proveer soporte técnico, monitoreo y mejoras continuas</li>
              <li>Cumplir con requisitos legales y de cumplimiento de Meta</li>
            </ul>
          </section>

          <section>
            <h3>3. Compartición de datos</h3>
            <p>No vendemos ni compartimos información personal con terceros, salvo en los siguientes casos:</p>
            <ul>
              <li>Con Meta Platforms Inc., para la activación y operación de APIs</li>
              <li>Con proveedores de infraestructura técnica bajo acuerdos de confidencialidad</li>
              <li>Cuando sea requerido por ley o autoridad competente</li>
            </ul>
          </section>

          <section>
            <h3>4. Seguridad</h3>
            <p>Implementamos medidas técnicas y organizativas para proteger la información, incluyendo:</p>
            <ul>
              <li>Acceso restringido a tokens y credenciales</li>
              <li>Segmentación de flujos por cliente</li>
              <li>Monitoreo de calidad y uso responsable de APIs</li>
            </ul>
          </section>

          <section>
            <h3>5. Derechos del usuario</h3>
            <p>Los usuarios pueden solicitar:</p>
            <ul>
              <li>Acceso, rectificación o eliminación de sus datos</li>
              <li>Revocar el consentimiento para el uso de sus datos</li>
              <li>Información sobre cómo se procesan sus datos</li>
            </ul>
            <p className="contact">
              Para ejercer estos derechos, escríbenos a neoslab.marketing@gmail.com
            </p>
          </section>

          <section>
            <h3>6. Cambios a esta política</h3>
            <p>
              Nos reservamos el derecho de actualizar esta política. Notificaremos 
              cualquier cambio importante a través de nuestro sitio web o canales oficiales.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
