import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SocialButtons() {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      if (credentialResponse.credential) {
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="flex gap-3 mt-2 flex-col sm:flex-row justify-center">
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="outline"
          shape="circle"
          width="250"
        />
      </div>
    </div>
  );
}

export default SocialButtons;
