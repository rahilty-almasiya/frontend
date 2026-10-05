import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12" }) => {
  return (
    <picture className="contents">
      <source srcSet="/assets/logo-512.webp" type="image/webp" />
      <img
        src="/assets/logo.png"
        alt="Rahilty Almasiya - My Diamond Journey"
        className={`object-contain ${className}`}
      />
    </picture>
  );
};

export default Logo;
