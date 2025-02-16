import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';

interface AsyncLinkProps {
    to: string;
    className?: string; // Ajout de la prop className
    children: React.ReactNode;
    OnClick?: () => void
  }
const AsyncLink = ({ to, className, children, OnClick }: AsyncLinkProps) => {
  const navigate = useNavigate();
  const loaderContext = useLoader();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher le comportement par défaut
    loaderContext?.startLoading?.();

    // Simuler une opération asynchrone (comme un appel API)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 secondes de délai

    navigate(to); // Naviguer vers la nouvelle page
    loaderContext?.completeLoading?.();
    OnClick?.();
  };

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default AsyncLink;
