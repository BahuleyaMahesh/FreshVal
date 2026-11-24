export const PRODUCTS = ['Croissant', 'Chocolate Cake', 'Muffin', 'Bread', 'Donut', 'Cinnamon Roll'] as const;
export type Product = (typeof PRODUCTS)[number];

export const SEASONS = ['Summer', 'Monsoon', 'Post-monsoon', 'Winter'] as const;
export type Season = (typeof SEASONS)[number];

export interface SalesObservation {
  id: string;
  date: string;
  product: Product;
  category: string;
  season: Season;
  sellingPrice: number;
  productionCost: number;
  availableInventory: number;
  unitsSold: number;
  competitorPrice: number;
  source?: 'demonstration' | 'actual';
}

export const productProfiles: Record<Product, { category: string; price: number; cost: number; inventory: number; demand: number }> = {
  Croissant: { category: 'Viennoiserie', price: 140, cost: 62, inventory: 52, demand: 38 },
  'Chocolate Cake': { category: 'Cakes', price: 420, cost: 205, inventory: 20, demand: 13 },
  Muffin: { category: 'Pastry', price: 110, cost: 45, inventory: 60, demand: 45 },
  Bread: { category: 'Loaves', price: 70, cost: 28, inventory: 78, demand: 62 },
  Donut: { category: 'Pastry', price: 85, cost: 32, inventory: 70, demand: 55 },
  'Cinnamon Roll': { category: 'Viennoiserie', price: 155, cost: 66, inventory: 45, demand: 31 },
};

const seasonDemandFactor: Record<Season, number> = { Summer: 0.91, Monsoon: 0.86, 'Post-monsoon': 1.08, Winter: 1.18 };
const seasonByIndex: Season[] = ['Winter', 'Winter', 'Summer', 'Monsoon', 'Monsoon', 'Post-monsoon', 'Post-monsoon', 'Winter', 'Summer', 'Summer', 'Monsoon', 'Post-monsoon', 'Winter', 'Winter', 'Summer', 'Monsoon', 'Post-monsoon', 'Winter'];
const dates = ['2025-01-06', '2025-01-14', '2025-01-22', '2025-01-30', '2025-02-07', '2025-02-15', '2025-02-23', '2025-03-03', '2025-03-11', '2025-03-19', '2025-03-27', '2025-04-04', '2025-04-12', '2025-04-20', '2025-04-28', '2025-05-06', '2025-05-14', '2025-05-22'];
const demandOffsets = [2, -1, 3, 0, -2, 1];
const priceOffsets = [0, 5, -5, 0, 5, -5];
const inventoryOffsets = [4, -3, 7, 0, -5, 3];

// Deterministic demonstration observations: no network, randomness, or generated values at render time.
export const sampleData: SalesObservation[] = dates.flatMap((date, dateIndex) =>
  PRODUCTS.map((product, productIndex) => {
    const profile = productProfiles[product];
    const season = seasonByIndex[dateIndex];
    const sellingPrice = profile.price + priceOffsets[(dateIndex + productIndex) % priceOffsets.length];
    const inventory = profile.inventory + inventoryOffsets[(dateIndex * 2 + productIndex) % inventoryOffsets.length];
    const unconstrainedDemand = Math.round(
      (profile.demand + demandOffsets[(dateIndex + productIndex) % demandOffsets.length]) *
        seasonDemandFactor[season] -
        (sellingPrice - profile.price) * 0.055,
    );
    const unitsSold = Math.max(4, Math.min(inventory, unconstrainedDemand));
    return {
      id: `demo-${dateIndex + 1}-${productIndex + 1}`,
      date,
      product,
      category: profile.category,
      season,
      sellingPrice,
      productionCost: profile.cost,
      availableInventory: inventory,
      unitsSold,
      competitorPrice: sellingPrice + (productIndex % 2 === 0 ? 8 : -12),
      source: 'demonstration',
    };
  }),
);

export const allProducts = [...PRODUCTS];
export const allSeasons = [...SEASONS];
