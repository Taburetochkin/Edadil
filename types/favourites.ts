import type { SearchCard } from "./products";

interface Favourites {
	favourites: SearchCard[];
	Page: number;
	PageSize: number;
	total: number;
}

export type { Favourites }