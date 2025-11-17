import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SIGN_IN_PATH } from '@/constants/paths';
import { useProfile } from '@/features/authentication/hooks/use-profile.hook';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data, isFetched } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched && !data) {
      navigate(SIGN_IN_PATH);
    }
  }, [isFetched, data, navigate]);

  return children;
};
