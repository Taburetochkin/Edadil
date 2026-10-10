import type { SearchCard } from "./products";

interface SearchByCategory {
	products: SearchCard[];
  Page: number;
  PageSize: number;
  total: number;
}

export type { SearchByCategory }