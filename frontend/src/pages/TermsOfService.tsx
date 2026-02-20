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
          <h2>Neos Lab WhatsApp API</h2>

          <section>
            <h3>1. Aceptación</h3>
            <p>
              Al comunicarse con Neos Lab mediante WhatsApp, el usuario acepta 
              estas Condiciones del Servicio.
            </p>
          </section>

          <section>
            <h3>2. Uso Permitido</h3>
            <p>El usuario se compromete a:</p>
            <ul>
              <li>Proporcionar información veraz</li>
              <li>No utilizar el canal para actividades ilícitas</li>
              <li>No enviar contenido ofensivo, fraudulento o ilegal</li>
            </ul>
          </section>

          <section>
            <h3>3. Comunicación</h3>
            <p>Neos Lab podrá:</p>
            <ul>
              <li>Responder consultas</li>
              <li>Enviar información relacionada con servicios solicitados</li>
              <li>Realizar seguimiento comercial legítimo</li>
            </ul>
            <p>En cualquier momento el usuario puede solicitar dejar de recibir comunicaciones.</p>
          </section>

          <section>
            <h3>4. Limitación de Responsabilidad</h3>
            <p>Neos Lab no se hace responsable por:</p>
            <ul>
              <li>Fallos técnicos de la plataforma de WhatsApp</li>
              <li>Interrupciones del servicio ajenas a su control</li>
              <li>Uso indebido del canal por parte del usuario</li>
            </ul>
          </section>

          <section>
            <h3>5. Modificaciones</h3>
            <p>
              Neos Lab podrá modificar estas condiciones cuando sea necesario.
              El uso continuo del servicio implica aceptación de los cambios.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TermsOfService;
