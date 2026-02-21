import { FaTelegram, FaWhatsapp, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiPlatzi } from 'react-icons/si';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='footer'>

      <div className='footer__social'>
        <a className="link" title="Platzi" href="https://platzi.com/p/leonard-rios/" target="_blank" rel="noopener noreferrer"><SiPlatzi /></a>
        <a className="link" title="Linkeding" href="https://mx.linkedin.com/in/leonardo-rios-pineda-979417216" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a className="link" title="Telegram" href="https://t.me/neosoir" target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
        <a className="link" title="WhatsApp" href="https://wa.me/5534044564" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
        <a className="link" title="Git Hub" href="https://github.com/neosoir" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a
          className="link"
          title="Email"
          href="mailto:neoslab.marketing@gmail.com?subject=Interesado%20en%20sus%20servicios&body=Estoy%20interesado%20en%20sus%20servicios."
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaEnvelope />
        </a>
      </div>
      <div className='footer__copyright'>
        <p>© 2025 Neos Lab. Todos los derechos reservados.</p>
      </div>
      
      <div className='footer__legal'>
        <h4>Datos fiscales</h4>
        <span>Leonardo Rios Pineda</span>
        <span>RFC: RIPL990424HT7</span>
        <span>neoslab.marketing@gmail.com</span>
      </div>

      <div className="footer__links">
        <Link to="/privacidad">Política de Privacidad</Link>
        <Link to="/terminos">Términos del Servicio</Link>
      </div>
    </footer>
  );
}

export default Footer;
