import { FaTelegram, FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__main'>
        <div className='footer__brand'>
          <h3>Neos Lab</h3>
          <p>Agencia de Publicidad y Marketing Digital</p>
          <p>Desarrollo de Software</p>
        </div>
        
        <div className='footer__contact'>
          <h4>Contacto</h4>
          <p><FaPhone /> Tel: [Teléfono]</p>
          <p><FaEnvelope /> Email: [Email]</p>
          <p><FaMapMarkerAlt /> [Dirección]</p>
        </div>

        <div className='footer__legal'>
          <h4>Información Legal</h4>
          <p>Razón Social: [Razón Social]</p>
          <p>RFC: [RFC]</p>
          <p>Dirección Fiscal: [Dirección Fiscal]</p>
          <div className="footer__links">
            <Link to="/privacidad">Política de Privacidad</Link>
            <Link to="/terminos">Términos del Servicio</Link>
          </div>
        </div>
      </div>
      
      <div className='footer__social'>
        <a className="link" title="TikTok" href="https://tiktok.com/@[Usuario]" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
        <a className="link" title="Instagram" href="https://instagram.com/[Instagram]" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a className="link" title="Facebook" href="https://facebook.com/[Facebook]" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a className="link" title="WhatsApp" href="https://wa.me/[WhatsApp]" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
        <a className="link" title="Telegram" href="https://t.me/[Telegram]" target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
        <a className="link" title="Email" href="mailto:[Email]" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
      </div>

      <div className='footer__copyright'>
        <p>© 2025 Neos Lab. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
