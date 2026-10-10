import type { SearchCard } from "./products";

interface ComparisonCategories {
	categories: ComparisonCard[]
}

interface ComparisonCard {
  id: string;
  name: string;
  products: SearchCard[];
  specs: Spec[];
}

interface Spec {
  name: string;
  values: Record<string, string>;
}

export type { ComparisonCategories, ComparisonCard }