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
          <h2>Neos Lab WhatsApp API</h2>

          <section>
            <h3>1. Responsable del Tratamiento</h3>
            <p>
              Neos Lab (en adelante "La Empresa") es responsable del tratamiento de los datos 
              personales recopilados a través de sus canales de comunicación digitales, 
              incluyendo WhatsApp Business Platform.
            </p>
            <p className="contact">Correo de contacto: neoslab.marketing@gmail.com</p>
          </section>

          <section>
            <h3>2. Datos que Recopilamos</h3>
            <p>Podemos recopilar los siguientes datos cuando un usuario interactúa con nosotros:</p>
            <ul>
              <li>Número telefónico</li>
              <li>Nombre visible en WhatsApp</li>
              <li>Contenido de mensajes enviados y recibidos</li>
              <li>Fecha y hora de interacción</li>
              <li>Información proporcionada voluntariamente por el usuario</li>
            </ul>
          </section>

          <section>
            <h3>3. Finalidad del Tratamiento</h3>
            <p>Los datos personales serán utilizados para:</p>
            <ul>
              <li>Atención a clientes y prospectos</li>
              <li>Gestión de solicitudes, cotizaciones o soporte</li>
              <li>Seguimiento comercial</li>
              <li>Comunicación relacionada con productos o servicios</li>
              <li>Análisis interno para mejora de procesos</li>
            </ul>
            <p className="highlight">No vendemos ni comercializamos datos personales a terceros.</p>
          </section>

          <section>
            <h3>4. Uso de WhatsApp Business Platform</h3>
            <p>
              La comunicación se realiza mediante la plataforma de WhatsApp Business 
              proporcionada por Meta Platforms, Inc. El uso de WhatsApp implica que 
              el usuario también está sujeto a las políticas de privacidad de dicha plataforma.
            </p>
          </section>

          <section>
            <h3>5. Conservación de la Información</h3>
            <p>
              Los datos serán almacenados únicamente durante el tiempo necesario para 
              cumplir con las finalidades mencionadas o para cumplir obligaciones legales aplicables.
            </p>
          </section>

          <section>
            <h3>6. Derechos del Usuario</h3>
            <p>El usuario puede solicitar:</p>
            <ul>
              <li>Acceso a sus datos</li>
              <li>Corrección de datos inexactos</li>
              <li>Eliminación de sus datos</li>
              <li>Oposición al tratamiento</li>
            </ul>
            <p className="contact">
              Para ejercer estos derechos, enviar solicitud a: neoslab.marketing@gmail.com
            </p>
          </section>

          <section>
            <h3>7. Seguridad</h3>
            <p>
              Implementamos medidas técnicas y organizativas razonables para proteger 
              la información contra acceso no autorizado, alteration o destrucción.
            </p>
          </section>

          <section>
            <h3>8. Cambios en la Política</h3>
            <p>
              Nos reservamos el derecho de actualizar esta política en cualquier momento.
              Las modificaciones serán publicadas en el mismo sitio donde se encuentre 
              disponible esta política.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
