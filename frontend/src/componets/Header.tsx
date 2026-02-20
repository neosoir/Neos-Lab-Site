import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <span>Neos Lab</span>
      </div>
      <div className="header__social">
        <a className="link" title="LinkedIn" href="https://linkedin.com/company/[Empresa]" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a className="link" title="Instagram" href="https://instagram.com/[Instagram]" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a className="link" title="Facebook" href="https://facebook.com/[Facebook]" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
      </div>
    </header>
  );
}

export default Header;
