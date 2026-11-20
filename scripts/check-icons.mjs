import * as lucide from 'lucide-react';

const icons = [
  'Atom', 'FlaskConical', 'FlaskRound', 'Beaker', 'Dna', 'TestTube', 'Flame', 'Sparkles', 'Layers',
  'Compass', 'Calculator', 'PieChart', 'TrendingUp', 'Maximize2', 'Sigma', 'FunctionSquare',
  'Variable', 'Hash', 'Grid', 'Shapes', 'Circle', 'Boxes', 'Scale', 'Link', 'Timer', 'Zap',
  'Wind', 'Cpu', 'Droplet', 'Anvil', 'RefreshCw', 'Box', 'Triangle', 'Slash', 'Percent',
  'MoveRight', 'Activity', 'Bookmark', 'Navigation', 'Binary'
];

const missing = icons.filter(name => !lucide[name]);
console.log('Missing icons:', missing);
