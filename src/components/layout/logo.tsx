import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'full';
  className?: string;
}

export function Logo({ variant = 'default', className }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <img 
          src="https://i.postimg.cc/8PRCMW45/output-onlinepngtools-1.png" 
          alt="Logo"
          className="h-16 w-auto" 
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="https://i.postimg.cc/8PRCMW45/output-onlinepngtools-1.png" 
        alt="Logo"
        className="h-8 w-auto" 
      />
    </div>
  );
}