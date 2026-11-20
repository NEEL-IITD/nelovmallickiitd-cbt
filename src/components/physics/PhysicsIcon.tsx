// ==============================================================================
// NelovMallickIITD · Physics Icon Resolver Component
// Renders dynamic, responsive icons for all 28 Physics Chapters
// ==============================================================================

import React from 'react';
import {
  Ruler,
  Target,
  Compass,
  Gauge,
  Layers,
  RotateCw,
  Crosshair,
  Disc,
  Globe,
  Activity,
  Droplets,
  Droplet,
  Timer,
  Volume2,
  Flame,
  Thermometer,
  Zap,
  Shield,
  BatteryCharging,
  Cpu,
  Magnet,
  Shuffle,
  Sun,
  Waves,
  Atom,
  Radiation,
  BookOpen,
  Sparkles,
  LucideProps
} from 'lucide-react';

interface PhysicsIconProps extends LucideProps {
  name: string;
  className?: string;
}

export const PhysicsIcon: React.FC<PhysicsIconProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Ruler':
      return <Ruler className={className} {...props} />;
    case 'Target':
      return <Target className={className} {...props} />;
    case 'Compass':
      return <Compass className={className} {...props} />;
    case 'Gauge':
      return <Gauge className={className} {...props} />;
    case 'Layers':
      return <Layers className={className} {...props} />;
    case 'RotateCw':
      return <RotateCw className={className} {...props} />;
    case 'Crosshair':
      return <Crosshair className={className} {...props} />;
    case 'Disc':
      return <Disc className={className} {...props} />;
    case 'Globe':
      return <Globe className={className} {...props} />;
    case 'Activity':
      return <Activity className={className} {...props} />;
    case 'Droplets':
      return <Droplets className={className} {...props} />;
    case 'Droplet':
      return <Droplet className={className} {...props} />;
    case 'Timer':
      return <Timer className={className} {...props} />;
    case 'Volume2':
      return <Volume2 className={className} {...props} />;
    case 'Flame':
      return <Flame className={className} {...props} />;
    case 'Thermometer':
      return <Thermometer className={className} {...props} />;
    case 'Zap':
      return <Zap className={className} {...props} />;
    case 'Shield':
      return <Shield className={className} {...props} />;
    case 'BatteryCharging':
      return <BatteryCharging className={className} {...props} />;
    case 'Cpu':
      return <Cpu className={className} {...props} />;
    case 'Magnet':
      return <Magnet className={className} {...props} />;
    case 'Shuffle':
      return <Shuffle className={className} {...props} />;
    case 'Sun':
      return <Sun className={className} {...props} />;
    case 'Waves':
      return <Waves className={className} {...props} />;
    case 'Atom':
      return <Atom className={className} {...props} />;
    case 'Radiation':
      return <Radiation className={className} {...props} />;
    case 'BookOpen':
      return <BookOpen className={className} {...props} />;
    default:
      return <Sparkles className={className} {...props} />;
  }
};
