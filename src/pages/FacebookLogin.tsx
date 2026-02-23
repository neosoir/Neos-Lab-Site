import { useEffect, useState } from 'react';
import './FacebookLogin.css';

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
      login: (callback: (response: LoginStatusResponse) => void, config?: { scope?: string; config_id?: string; response_type?: string; override_default_response_type?: boolean }) => void;
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
    code?: string;
  };
}

function FacebookLogin() {
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
    console.log('Facebook Login Response:', response);
    setLoginStatus(response.status);
    
    if (response.status === 'connected' && response.authResponse) {
      if (response.authResponse.userID) {
        setUserId(response.authResponse.userID);
        console.log('Logged in with Facebook. User ID:', response.authResponse.userID);
        console.log('Access Token:', response.authResponse.accessToken);
      } else if (response.authResponse.code) {
        console.log('Received authorization code:', response.authResponse.code);
        console.log('This is a System User Access Token flow. Code needs to be exchanged for token on server.');
      }
    }
  };

  const handleLogin = () => {
    window.FB.login(function(response: LoginStatusResponse) {
      statusChangeCallback(response);
    }, { 
      config_id: '1452962549503611'
    });
  };

  const handleLogout = () => {
    window.FB.logout(function(response: LoginStatusResponse) {
      statusChangeCallback(response);
      setUserId('');
    });
  };

  return (
    <div className="facebook-login__container">
      <div className="facebook-login__card">
        <h1>Login con Facebook</h1>
        
        {loginStatus === 'checking' && (
          <p>Cargando estado de autenticación...</p>
        )}

        {loginStatus === 'connected' && (
          <div className="facebook-login__success">
            <p>¡Has iniciado sesión correctamente!</p>
            <p className="facebook-login__user-id">
              <strong>User ID:</strong> {userId}
            </p>
            <button onClick={handleLogout} className="facebook-login__btn logout">
              Cerrar sesión
            </button>
          </div>
        )}

        {loginStatus === 'not_authorized' && (
          <div className="facebook-login__not-authorized">
            <p>Has iniciado sesión en Facebook pero no has autorizado la app.</p>
            <button onClick={handleLogin} className="facebook-login__btn login">
              Iniciar sesión con Facebook
            </button>
          </div>
        )}

        {loginStatus === 'unknown' && (
          <div className="facebook-login__unknown">
            <p>No has iniciado sesión en Facebook.</p>
            <button onClick={handleLogin} className="facebook-login__btn login">
              Iniciar sesión con Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacebookLogin;
