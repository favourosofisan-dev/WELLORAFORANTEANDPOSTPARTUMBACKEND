import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img src="/images/wellora-mama-logo.png" alt="Wellora Mama" className="w-32 h-32 animate-pulse" />
    </div>
  );
};

export default SplashScreen;
