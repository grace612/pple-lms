// src/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useRouter } from '@/hooks/useRouter';
import toast from 'react-hot-toast';
import { SESSION_KEY } from '@/utils/constant';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()
  const cookieName = SESSION_KEY; // 쿠키 이름을 지정하세요.

  useEffect(() => {
    const token = Cookies.get(cookieName);
    if (!token) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
