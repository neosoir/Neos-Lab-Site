import Header from '../componets/Header';
import Footer from '../componets/Footer';
import './LegalPages.css';

function DataDeletion() {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-content">
          <h1>ELIMINACIÓN DE DATOS PERSONALES</h1>
          <h2>Neos Lab WhatsApp API</h2>

          <section>
            <h3>1. Derecho a la Eliminación</h3>
            <p>
              En cumplimiento con las regulaciones de protección de datos y los requisitos 
              de Meta para Tech Providers, respeitamos su derecho a solicitar la 
              eliminación completa de sus datos personales de nuestros sistemas.
            </p>
          </section>

          <section>
            <h3>2. Datos que Podemos Eliminar</h3>
            <p>Upon request, we can delete the following data:</p>
            <ul>
              <li>Número telefónico utilizado en comunicaciones</li>
              <li>Nombre visible en WhatsApp</li>
              <li>Historial de mensajes enviados y recibidos</li>
              <li>Fecha y hora de interacciones</li>
              <li>Cualquier información voluntaria proporcionada</li>
              <li>Registros de conversaciones con el asistente virtual</li>
            </ul>
          </section>

          <section>
            <h3>3. Cómo Solicitar la Eliminación</h3>
            <p>
              Para solicitar la eliminación de sus datos personales, envíe un correo 
              electrónico a:
            </p>
            <p className="contact">Correo de contacto: neoslab.marketing@gmail.com</p>
            <p>
              Incluya en su solicitud:
            </p>
            <ul>
              <li>Nombre completo</li>
              <li>Número de teléfono asociado a la cuenta</li>
              <li>Correo electrónico de contacto</li>
              <li>Declaración expresa de solicitud de eliminación de datos</li>
            </ul>
          </section>

          <section>
            <h3>4. Plazo de Respuesta</h3>
            <p>
              responderemos a su solicitud dentro de los 30 días siguientes a la 
              recepción de la misma. La eliminación de datos se realizará de manera 
              completa y permanente de nuestros sistemas activos.
            </p>
          </section>

          <section>
            <h3>5. Excepciones</h3>
            <p>
              Podemos retener ciertos datos cuando sea requerido por ley o cuando 
              sea necesario para:
            </p>
            <ul>
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas</li>
              <li>Hacer cumplir nuestros acuerdos</li>
            </ul>
          </section>

          <section>
            <h3>6. Eliminación en WhatsApp</h3>
            <p>
              Tenga en cuenta que la eliminación de datos de nuestros sistemas no 
              elimina automáticamente sus datos de la plataforma de WhatsApp 
              (propiedad de Meta Platforms, Inc.). Para ello, deberá gestionar 
              la eliminación directamente desde la configuración de su cuenta de WhatsApp.
            </p>
          </section>

          <section>
            <h3>7. Confirmación de Eliminación</h3>
            <p>
              Una vez completada la eliminación de sus datos, recibirá una 
              confirmación por correo electrónico indicando que su solicitud 
              ha sido procesada satisfactoriamente.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DataDeletion;
