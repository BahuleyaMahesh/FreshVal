import type { Product } from './sampleData';

export interface CompetitorObservation {
  id: string;
  name: string;
  product: Product;
  price: number;
  packageSize: string;
  date: string;
  source?: 'demonstration' | 'actual';
}

export const initialCompetitorData: CompetitorObservation[] = [
  { id: 'comp-1', name: 'Neighbourhood Bakehouse', product: 'Croissant', price: 150, packageSize: '1 piece', date: '2025-05-18', source: 'demonstration' },
  { id: 'comp-2', name: 'Morning Crumb', product: 'Croissant', price: 135, packageSize: '1 piece', date: '2025-05-16', source: 'demonstration' },
  { id: 'comp-3', name: 'The Daily Loaf', product: 'Croissant', price: 160, packageSize: '1 piece', date: '2025-05-12', source: 'demonstration' },
  { id: 'comp-4', name: 'Neighbourhood Bakehouse', product: 'Muffin', price: 120, packageSize: '1 piece', date: '2025-05-18', source: 'demonstration' },
  { id: 'comp-5', name: 'Morning Crumb', product: 'Muffin', price: 105, packageSize: '1 piece', date: '2025-05-16', source: 'demonstration' },
  { id: 'comp-6', name: 'The Daily Loaf', product: 'Muffin', price: 115, packageSize: '1 piece', date: '2025-05-12', source: 'demonstration' },
  { id: 'comp-7', name: 'Neighbourhood Bakehouse', product: 'Bread', price: 75, packageSize: '500 g', date: '2025-05-18', source: 'demonstration' },
  { id: 'comp-8', name: 'Morning Crumb', product: 'Bread', price: 65, packageSize: '500 g', date: '2025-05-16', source: 'demonstration' },
];
