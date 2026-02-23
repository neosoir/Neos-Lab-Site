import Header from '../componets/Header';
import Footer from '../componets/Footer';
import './LegalPages.css';

function TermsOfService() {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-content">
          <h1>CONDICIONES DEL SERVICIO</h1>
          <p className="last-update">Última actualización: 20 de febrero de 2026</p>

          <section>
            <p>
              Estas Condiciones del Servicio regulan el uso de las soluciones de 
              automatización ofrecidas por Neos Lab a través de plataformas como 
              WhatsApp Business API, Facebook Messenger, Instagram Messaging y n8n.
            </p>
          </section>

          <section>
            <h3>1. Servicios ofrecidos</h3>
            <p>Neos Lab provee a empresas clientes:</p>
            <ul>
              <li>Automatización de bandejas de entrada de WhatsApp</li>
              <li>Chatbots para recordatorios de agendamientos, atención al cliente y flujos personalizados</li>
              <li>Integraciones con Meta APIs y plataformas de terceros como n8n</li>
              <li>Soporte técnico y documentación para la activación y operación de canales digitales</li>
            </ul>
          </section>

          <section>
            <h3>2. Responsabilidades del cliente</h3>
            <p>El cliente se compromete a:</p>
            <ul>
              <li>Proveer activos válidos (número de WhatsApp, página de Facebook, perfil de Instagram)</li>
              <li>Mantener su portafolio comercial verificado en Meta Business Manager</li>
              <li>Usar los servicios conforme a las políticas de Meta y leyes aplicables</li>
              <li>No enviar contenido prohibido, spam o mensajes no solicitados</li>
            </ul>
          </section>

          <section>
            <h3>3. Responsabilidades de Neos Lab</h3>
            <p>Neos Lab se compromete a:</p>
            <ul>
              <li>Configurar y operar los flujos técnicos de forma segura y segmentada</li>
              <li>Mantener la confidencialidad de tokens, credenciales y datos del cliente</li>
              <li>Proveer soporte técnico y documentación clara</li>
              <li>No usar los activos del cliente para fines distintos a los contratados</li>
            </ul>
          </section>

          <section>
            <h3>4. Limitación de responsabilidad</h3>
            <p>Neos Lab no se hace responsable por:</p>
            <ul>
              <li>Suspensiones o bloqueos realizados por Meta</li>
              <li>Errores derivados de activos mal configurados por el cliente</li>
              <li>Pérdida de datos por uso indebido de la API fuera de los flujos autorizados</li>
            </ul>
          </section>

          <section>
            <h3>5. Modificaciones</h3>
            <p>
              Estas condiciones pueden actualizarse. Se notificará a los clientes 
              por correo o a través del sitio web.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TermsOfService;
