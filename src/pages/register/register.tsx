import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUserThunk,
  userLoadingSelector
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(userLoadingSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  if (isLoading) {
    return <Preloader />;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(registerUserThunk({ name: userName, email, password }));
    navigate(from, { replace: true });
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
