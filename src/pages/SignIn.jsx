import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CALIENTE_PIECES_BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/caliente';

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSignIn = (role) => {
    signIn(role);
    navigate('/', { replace: true });
  };

  return (
    <>
      <h1 className="page-heading">Sign in</h1>
      <p className="page-sub">
        Sign in to save progress and sync across devices. Choose a role to try the app.
      </p>
      <div className="sign-in-options">
        <button
          type="button"
          className="sign-in-option"
          onClick={() => handleSignIn('member')}
        >
          <img
            src={`${CALIENTE_PIECES_BASE}/wN.svg`}
            alt=""
            width={48}
            height={48}
            className="sign-in-option-piece"
          />
          <span className="sign-in-option-label">Sign in as member</span>
          <span className="sign-in-option-hint">Knight</span>
        </button>
        <button
          type="button"
          className="sign-in-option"
          onClick={() => handleSignIn('coach')}
        >
          <img
            src={`${CALIENTE_PIECES_BASE}/wQ.svg`}
            alt=""
            width={48}
            height={48}
            className="sign-in-option-piece"
          />
          <span className="sign-in-option-label">Sign in as coach</span>
          <span className="sign-in-option-hint">Queen</span>
        </button>
      </div>
    </>
  );
}
