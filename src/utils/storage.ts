import type { CompetitorObservation } from '../data/competitorData';
import type { SalesObservation } from '../data/sampleData';

const ACTUAL_RECORDS_KEY = 'freshval.actual-records.v1';
const COMPETITOR_RECORDS_KEY = 'freshval.competitor-records.v1';

function read<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const loadActualRecords = () => read<SalesObservation[]>(ACTUAL_RECORDS_KEY, []);
export const saveActualRecords = (records: SalesObservation[]) => write(ACTUAL_RECORDS_KEY, records);
export const loadCompetitorRecords = (fallback: CompetitorObservation[]) => read<CompetitorObservation[]>(COMPETITOR_RECORDS_KEY, fallback);
export const saveCompetitorRecords = (records: CompetitorObservation[]) => write(COMPETITOR_RECORDS_KEY, records);

export function recordsToCsv(records: SalesObservation[]) {
  const headers = ['date', 'product', 'productionCost', 'sellingPrice', 'season', 'availableInventory', 'unitsSold'];
  const rows = records.map((record) => [record.date, record.product, record.productionCost, record.sellingPrice, record.season, record.availableInventory, record.unitsSold]);
  return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
}

export function parseSalesCsv(csv: string): Omit<SalesObservation, 'id' | 'category' | 'competitorPrice' | 'source'>[] {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const index = new Map(lines[0].split(',').map((header, i) => [header.replaceAll('"', '').trim(), i]));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.replace(/^"|"$/g, '').replaceAll('""', '"').trim());
    return {
      date: values[index.get('date') ?? 0],
      product: values[index.get('product') ?? 1] as SalesObservation['product'],
      productionCost: Number(values[index.get('productionCost') ?? 2]),
      sellingPrice: Number(values[index.get('sellingPrice') ?? 3]),
      season: values[index.get('season') ?? 4] as SalesObservation['season'],
      availableInventory: Number(values[index.get('availableInventory') ?? 5]),
      unitsSold: Number(values[index.get('unitsSold') ?? 6]),
    };
  }).filter((record) => record.product && Number.isFinite(record.sellingPrice) && Number.isFinite(record.unitsSold));
}
