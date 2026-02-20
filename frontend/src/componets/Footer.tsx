import { FaTelegram, FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTiktok, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiPlatzi } from 'react-icons/si';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__main'>
        <div className='footer__legal'>
          <h4>Datos fiscales</h4>
          <p>Leonardo Rios Pineda</p>
          <p>RFC: RIPL990424HT7</p>
          <p>neoslab.marketing@gmail.com</p>
          <div className="footer__links">
            <Link to="/privacidad">Política de Privacidad</Link>
            <Link to="/terminos">Términos del Servicio</Link>
          </div>
        </div>
      </div>
      
      <div className='footer__social'>
        <a className="link" title="Platzi" href="https://platzi.com/p/leonard-rios/" target="_blank" rel="noopener noreferrer"><SiPlatzi /></a>
        <a className="link" title="Linkeding" href="https://mx.linkedin.com/in/leonardo-rios-pineda-979417216" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a className="link" title="Telegram" href="https://t.me/[Telegram]" target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
        <a className="link" title="WhatsApp" href="https://wa.me/[WhatsApp]" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
        <a className="link" title="Email" href="mailto:[Email]" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
        <a className="link" title="Git Hub" href="https://github.com/neosoir" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
      </div>

      <div className='footer__copyright'>
        <p>© 2025 Neos Lab. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
