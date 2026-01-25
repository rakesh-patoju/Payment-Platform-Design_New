import logoImage from '../../assets/logo.png';


interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <img 
        src={logoImage} 
        alt="TECHNOGENT Logo" 
        className="h-50 w-auto mb-2"
      />
    </div>
  );
};
