import type { Product, Season } from '../data/sampleData';
import { productProfiles } from '../data/sampleData';
import type { DemandModel } from './model';
import { predictDemand } from './model';

export interface PricingInputs {
  product: Product;
  currentPrice: number;
  productionCost: number;
  inventory: number;
  season: Season;
  competitorPrice: number;
  minPrice: number;
}

export interface CandidatePrice {
  price: number;
  demand: number;
  expectedUnits: number;
  revenue: number;
  contribution: number;
  unsold: number;
  isRecommended?: boolean;
}

export interface PricingAnalysis {
  candidates: CandidatePrice[];
  recommendation: CandidatePrice;
  currentDemand: number;
}

export function calculatePricing(inputs: PricingInputs, model: DemandModel): PricingAnalysis {
  const profile = productProfiles[inputs.product];
  const lowerBound = Math.max(inputs.productionCost, inputs.minPrice, profile.price * 0.7);
  const upperBound = Math.max(lowerBound + 10, profile.price * 1.35, inputs.currentPrice * 1.28);
  const step = upperBound - lowerBound > 180 ? 20 : 10;
  const candidates = Array.from({ length: 9 }, (_, index) => {
    const ratio = index / 8;
    const price = Math.round((lowerBound + (upperBound - lowerBound) * ratio) / step) * step;
    const demand = predictDemand(model, inputs.product, price, inputs.season);
    const expectedUnits = Math.min(demand, Math.max(0, inputs.inventory));
    return {
      price,
      demand,
      expectedUnits,
      revenue: price * expectedUnits,
      contribution: Math.max(0, price - inputs.productionCost) * expectedUnits,
      unsold: Math.max(0, inputs.inventory - expectedUnits),
    };
  }).filter((candidate, index, all) => all.findIndex((item) => item.price === candidate.price) === index);
  const recommendation = candidates.reduce((best, candidate) => candidate.contribution > best.contribution ? candidate : best, candidates[0]);
  const ranked = candidates.map((candidate) => ({ ...candidate, isRecommended: candidate.price === recommendation.price }));
  return {
    candidates: ranked,
    recommendation: ranked.find((candidate) => candidate.isRecommended) ?? ranked[0],
    currentDemand: predictDemand(model, inputs.product, inputs.currentPrice, inputs.season),
  };
}
