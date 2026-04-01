import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUserThunk,
  userLoadingSelector,
  errorSelector,
  clearError
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };
  const isLoading = useSelector(userLoadingSelector);
  const error = useSelector(errorSelector);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUserThunk({ email, password }));
    if (loginUserThunk.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={(value) => {
        setEmail(value);
        if (error) dispatch(clearError());
      }}
      password={password}
      setPassword={(value) => {
        setPassword(value);
        if (error) dispatch(clearError());
      }}
      handleSubmit={handleSubmit}
    />
  );
};
