import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_KEY = 'ff_auth_user';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem(AUTH_KEY);
    navigate('/login');
  }, [navigate]);

  return null;
}

export default LogoutPage;
