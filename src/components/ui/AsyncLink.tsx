import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';

interface AsyncLinkProps {
    to: string;
    className?: string;
    children: React.ReactNode;
    OnClick?: () => void
}

const AsyncLink = ({ to, className, children, OnClick }: AsyncLinkProps) => {
  const navigate = useNavigate();
  const loaderContext = useLoader();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Add semi-transparent black overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9998';
    document.body.appendChild(overlay);

    loaderContext?.startLoading?.();

    // Simuler une opération asynchrone (comme un appel API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Remove overlay after loading
    document.body.removeChild(overlay);
    
    navigate(to);
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
