import { FaTiktok, FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { SiLinkedin } from "react-icons/si";

function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <img src="/core_color.png" alt="Neos Lab" className="header__logo-img" />
        <div className="header__text">
          <span className="header__title">Neos Lab</span>
          <span className="header__subtitle">Agencia de Marketing Digital</span>
        </div>
      </div>
      <div className="header__social">
        <a className="link" title="TikTok" href="https://tiktok.com/@[Usuario]" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
        <a className="link" title="Instagram" href="https://instagram.com/[Instagram]" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a className="link" title="Facebook" href="https://facebook.com/[Facebook]" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a className="link" title="LinkedIn" href="https://linkedin.com/company/[Empresa]" target="_blank" rel="noopener noreferrer"><SiLinkedin /></a>
        <a className="link" title="WhatsApp" href="https://wa.me/[WhatsApp]" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
      </div>
    </header>
  );
}

export default Header;
