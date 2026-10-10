import type { SearchCard } from "./products";

interface LLMResponse {
  comment: string;
	products: SearchCard[]
}

export type { LLMResponse }