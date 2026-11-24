import type { Product, SalesObservation, Season } from '../data/sampleData';
import { PRODUCTS, SEASONS } from '../data/sampleData';

export interface ModelMetrics {
  mae: number;
  rmse: number;
  trainingCount: number;
  testCount: number;
  lastTrainingTime: string;
  warning?: string;
}

export interface DemandModel {
  weights: number[];
  priceMean: number;
  priceScale: number;
  metrics: ModelMetrics;
}

function vector(product: Product, price: number, season: Season, priceMean: number, priceScale: number) {
  return [1, (price - priceMean) / priceScale, ...PRODUCTS.map((item) => (item === product ? 1 : 0)), ...SEASONS.map((item) => (item === season ? 1 : 0))];
}

function predictWithWeights(weights: number[], features: number[]) {
  return Math.max(0, weights.reduce((sum, weight, index) => sum + weight * (features[index] ?? 0), 0));
}

export function trainDemandModel(observations: SalesObservation[]): DemandModel {
  const priceMean = observations.reduce((sum, item) => sum + item.sellingPrice, 0) / Math.max(1, observations.length);
  const priceScale = Math.max(20, Math.sqrt(observations.reduce((sum, item) => sum + Math.pow(item.sellingPrice - priceMean, 2), 0) / Math.max(1, observations.length)));
  const training = observations.filter((_, index) => index % 5 !== 0);
  const test = observations.filter((_, index) => index % 5 === 0);
  const featureCount = 2 + PRODUCTS.length + SEASONS.length;
  const weights = new Array(featureCount).fill(0);
  weights[0] = observations.reduce((sum, item) => sum + item.unitsSold, 0) / Math.max(1, observations.length);
  const learningRate = 0.018;
  const epochs = 5000;

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    const gradient = new Array(featureCount).fill(0);
    training.forEach((item) => {
      const features = vector(item.product, item.sellingPrice, item.season, priceMean, priceScale);
      const error = predictWithWeights(weights, features) - item.unitsSold;
      features.forEach((feature, index) => { gradient[index] += error * feature; });
    });
    gradient.forEach((value, index) => { weights[index] -= (learningRate * value) / Math.max(1, training.length); });
  }

  const errors = test.map((item) => predictWithWeights(weights, vector(item.product, item.sellingPrice, item.season, priceMean, priceScale)) - item.unitsSold);
  const mae = errors.length ? errors.reduce((sum, error) => sum + Math.abs(error), 0) / errors.length : 0;
  const rmse = errors.length ? Math.sqrt(errors.reduce((sum, error) => sum + error * error, 0) / errors.length) : 0;
  return {
    weights,
    priceMean,
    priceScale,
    metrics: {
      mae,
      rmse,
      trainingCount: training.length,
      testCount: test.length,
      lastTrainingTime: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      warning: observations.length < 24 ? 'Add more actual observations before treating this estimate as reliable.' : undefined,
    },
  };
}

export function predictDemand(model: DemandModel, product: Product, price: number, season: Season) {
  return predictWithWeights(model.weights, vector(product, price, season, model.priceMean, model.priceScale));
}
