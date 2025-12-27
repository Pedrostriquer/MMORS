import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import Loader from '../../components/Loader/Loader';

/**
 * Componente de Ordem Superior (HOC) para proteger rotas administrativas.
 * Verifica se existe um utilizador autenticado no Firebase antes de renderizar o conteúdo.
 */
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscreve ao observador de estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa a subscrição ao desmontar o componente
    return () => unsubscribe();
  }, []);

  // Enquanto o Firebase está a verificar a sessão, mostra o Loader global
  if (loading) {
    return <Loader />;
  }

  // Se após o carregamento não houver utilizador, redireciona para o login do admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se estiver autenticado, renderiza os componentes filhos (ex: Dashboard)
  return children;
};

export default ProtectedRoute;