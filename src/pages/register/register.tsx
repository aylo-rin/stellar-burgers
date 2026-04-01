import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUserThunk,
  userLoadingSelector,
  errorSelector,
  clearError
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
  const error = useSelector(errorSelector);

  if (isLoading) {
    return <Preloader />;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(
      registerUserThunk({ name: userName, email, password })
    );
    if (registerUserThunk.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={(value) => {
        setEmail(value);
        if (error) dispatch(clearError());
      }}
      setPassword={(value) => {
        setPassword(value);
        if (error) dispatch(clearError());
      }}
      setUserName={(value) => {
        setUserName(value);
        if (error) dispatch(clearError());
      }}
      handleSubmit={handleSubmit}
    />
  );
};
