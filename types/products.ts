interface Content {
	[key: string]: string | Content;
}

interface SearchCard {
  created_at?: string;
  updated_at?: string;
  id: string;
  name: string;
  min_price: number;
  photo_url: string;
}

interface ParsedProduct {
  id: string;
  market: string;
  photo_urls?: string[];
  price: number;
  product_url: string;
}

interface ParsedProducts {
  parsedProducts: ParsedProduct[]
}

interface AbstractProduct {
  product: AbstractProductContent
}

interface AbstractProductContent {
  content: Content;
  created_at?: string;
   updated_at?: string;
  id: string;
  name: string;
}

export type { Content, SearchCard, ParsedProduct, ParsedProducts, AbstractProduct, AbstractProductContent }