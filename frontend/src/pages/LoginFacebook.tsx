import { useEffect, useState } from 'react';
import './LoginFacebook.css';

declare global {
  interface Window {
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents: {
        logPageView: () => void;
      };
      getLoginStatus: (callback: (response: LoginStatusResponse) => void) => void;
      login: (callback: (response: LoginStatusResponse) => void, config?: { scope: string }) => void;
      logout: (callback: (response: LoginStatusResponse) => void) => void;
    };
    fbAsyncInit: () => void;
  }
}

interface LoginStatusResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  };
}

function LoginFacebook() {
  const [loginStatus, setLoginStatus] = useState<string>('checking');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/es_ES/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1833709260481612',
        cookie: true,
        xfbml: true,
        version: 'v25.0'
      });

      window.FB.AppEvents.logPageView();
      checkLoginStatus();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const checkLoginStatus = () => {
    window.FB.getLoginStatus(function(response: LoginStatusResponse) {
      statusChangeCallback(response);
    });
  };

  const statusChangeCallback = (response: LoginStatusResponse) => {
    setLoginStatus(response.status);
    
    if (response.status === 'connected' && response.authResponse) {
      setUserId(response.authResponse.userID);
      console.log('Logged in with Facebook. User ID:', response.authResponse.userID);
      console.log('Access Token:', response.authResponse.accessToken);
    }
  };

  const handleLogin = () => {
    window.FB.login(function(response: LoginStatusResponse) {
      statusChangeCallback(response);
    }, { scope: 'public_profile,email' });
  };

  const handleLogout = () => {
    window.FB.logout(function(response: LoginStatusResponse) {
      statusChangeCallback(response);
      setUserId('');
    });
  };

  return (
    <div className="login-facebook__container">
      <div className="login-facebook__card">
        <h1>Login con Facebook</h1>
        
        {loginStatus === 'checking' && (
          <p>Cargando estado de autenticación...</p>
        )}

        {loginStatus === 'connected' && (
          <div className="login-facebook__success">
            <p>¡Has iniciado sesión correctamente!</p>
            <p className="login-facebook__user-id">
              <strong>User ID:</strong> {userId}
            </p>
            <button onClick={handleLogout} className="login-facebook__btn logout">
              Cerrar sesión
            </button>
          </div>
        )}

        {loginStatus === 'not_authorized' && (
          <div className="login-facebook__not-authorized">
            <p>Has iniciado sesión en Facebook pero no has autorizado la app.</p>
            <button onClick={handleLogin} className="login-facebook__btn login">
              Iniciar sesión con Facebook
            </button>
          </div>
        )}

        {loginStatus === 'unknown' && (
          <div className="login-facebook__unknown">
            <p>No has iniciado sesión en Facebook.</p>
            <button onClick={handleLogin} className="login-facebook__btn login">
              Iniciar sesión con Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginFacebook;
