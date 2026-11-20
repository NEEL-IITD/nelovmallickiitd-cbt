// ==============================================================================
// NelovMallickIITD · Subject & Chapter Dynamic Icon Component
// Maps string icon names to Lucide icons with subject-aware color accents
// ==============================================================================

import React from 'react';
import {
  Atom, FlaskConical, FlaskRound, Beaker, Dna, TestTube, Flame, Sparkles, Layers,
  Compass, Calculator, PieChart, TrendingUp, Maximize2, FunctionSquare,
  Variable, Hash, Grid, Shapes, Circle, Boxes, Scale, Link, Timer, Zap,
  Wind, Cpu, Droplet, RefreshCw, Box, Triangle, Slash, Percent,
  MoveRight, Activity, Bookmark, Navigation, Binary, HelpCircle, Orbit, Wine, Shield
} from 'lucide-react';

interface SubjectIconProps {
  name: string;
  className?: string;
  subject?: 'physics' | 'chemistry' | 'mathematics';
}

const ICON_MAP: Record<string, React.ElementType> = {
  // Common / Physics
  Atom,
  Orbit,
  Zap,
  Flame,
  Wind,
  Compass,
  Layers,
  Activity,
  Timer,
  Scale,
  Sparkles,
  Link,
  Cpu,
  Droplet,
  Box,
  Boxes,
  Circle,
  Shapes,
  Navigation,
  MoveRight,
  TrendingUp,
  Percent,
  Calculator,
  
  // Chemistry
  FlaskConical,
  FlaskRound,
  Beaker,
  Dna,
  TestTube,
  Wine,
  Shield,
  RefreshCw,
  
  // Mathematics
  FunctionSquare,
  Variable,
  Hash,
  Grid,
  Triangle,
  Slash,
  PieChart,
  Maximize2,
  Bookmark,
  Binary
};

export const SubjectIcon: React.FC<SubjectIconProps> = ({ name, className = 'w-6 h-6' }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} />;
};
