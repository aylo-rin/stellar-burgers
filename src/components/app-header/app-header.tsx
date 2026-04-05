import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(userSelector)?.name;

  return <AppHeaderUI userName={userName ? userName : ''} />;
};
