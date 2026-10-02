import {
  Utensils, Pill, Car, Package, BookOpen, HeartHandshake, HelpCircle,
} from 'lucide-react';

const map = {
  Food: { Icon: Utensils, color: 'text-amber-600' },
  Medicine: { Icon: Pill, color: 'text-brand-600' },
  Transportation: { Icon: Car, color: 'text-teal-700' },
  'Essential Supplies': { Icon: Package, color: 'text-amber-700' },
  Education: { Icon: BookOpen, color: 'text-brand-500' },
  'Elderly Assistance': { Icon: HeartHandshake, color: 'text-teal-600' },
  Other: { Icon: HelpCircle, color: 'text-muted' },
};

export default function CategoryIcon({ category, size = 18, className = '' }) {
  const entry = map[category] || map.Other;
  const { Icon, color } = entry;
  return <Icon size={size} className={`${color} ${className}`} strokeWidth={2.2} />;
}

export const CATEGORY_LIST = Object.keys(map);