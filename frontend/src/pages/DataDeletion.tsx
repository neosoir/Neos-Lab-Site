import Header from '../componets/Header';
import Footer from '../componets/Footer';
import './LegalPages.css';

function DataDeletion() {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-content">
          <h1>ELIMINACIÓN DE DATOS DE USUARIO</h1>
          <p className="last-update">Última actualización: 20 de febrero de 2026</p>

          <section>
            <p>
              Neos Lab respeta el derecho de los usuarios y clientes a solicitar 
              la eliminación de sus datos personales y técnicos.
            </p>
          </section>

          <section>
            <h3>¿Qué datos pueden eliminarse?</h3>
            <ul>
              <li>Tokens de acceso y credenciales API</li>
              <li>Logs de mensajes y actividad automatizada</li>
              <li>Datos de contacto y configuración de flujos</li>
            </ul>
          </section>

          <section>
            <h3>¿Cómo solicitar la eliminación?</h3>
            <p>
              El titular de los datos puede enviar una solicitud a 
              <span className="contact"> neoslab.marketing@gmail.com</span> indicando:
            </p>
            <ul>
              <li>Nombre del negocio o cliente</li>
              <li>Activo vinculado (número de WhatsApp, página, etc.)</li>
              <li>Tipo de datos que desea eliminar</li>
            </ul>
            <p className="highlight">
              La solicitud será atendida en un plazo máximo de 10 días hábiles.
            </p>
          </section>

          <section>
            <h3>¿Qué ocurre tras la eliminación?</h3>
            <ul>
              <li>Se desactivan los flujos automatizados vinculados</li>
              <li>Se revocan tokens y accesos técnicos</li>
              <li>Se elimina la información de nuestros sistemas internos y respaldos</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DataDeletion;
