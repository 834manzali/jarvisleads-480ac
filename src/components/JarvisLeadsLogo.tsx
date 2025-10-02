import { motion } from 'motion/react';

interface JarvisLeadsLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withGlow?: boolean;
  animated?: boolean;
}

export function JarvisLeadsLogo({ 
  className = "", 
  showText = true, 
  size = 'md',
  withGlow = false,
  animated = false
}: JarvisLeadsLogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-sm' },
    md: { icon: 'w-8 h-8', text: 'text-lg' },
    lg: { icon: 'w-12 h-12', text: 'text-xl' }
  };

  const LogoIcon = animated ? motion.div : 'div';
  const LogoContainer = animated ? motion.div : 'div';

  const iconProps = animated ? {
    animate: withGlow ? {
      filter: [
        'drop-shadow(0 0 10px rgba(255, 107, 53, 0.3))',
        'drop-shadow(0 0 20px rgba(255, 107, 53, 0.6))',
        'drop-shadow(0 0 10px rgba(255, 107, 53, 0.3))',
      ],
      scale: [1, 1.05, 1],
    } : {},
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }
  } : {};

  const containerProps = animated ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  } : {};

  return (
    <LogoContainer className={`flex items-center gap-2 ${className}`} {...containerProps}>
      <LogoIcon 
        className={`${sizes[size].icon} bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center shadow-lg ${withGlow ? 'logo-glow' : ''}`}
        {...iconProps}
      >
        {withGlow && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg blur-sm opacity-30 -z-10" />
        )}
        <span className="text-white font-bold text-xs sm:text-sm relative z-10">JL</span>
      </LogoIcon>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground ${sizes[size].text} logo-font`}>
            Jarvis Leads
          </span>
          {size === 'lg' && (
            <span className="text-xs text-muted-foreground -mt-1">
              LeadGen Platform
            </span>
          )}
        </div>
      )}
    </LogoContainer>
  );
}