export type BlockType = 
  | 'title'
  | 'image'
  | 'text'
  | 'banner-link'
  | 'product-cards'
  | 'about-store';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface TitleBlock extends BaseBlock {
  type: 'title';
  data: {
    text: string;
    level: 'h1' | 'h2' | 'h3';
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: {
    url: string;
    alt: string;
    caption?: string;
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  data: {
    content: string; // HTML content
  };
}

export interface BannerLinkBlock extends BaseBlock {
  type: 'banner-link';
  data: {
    imageUrl: string;
    title: string;
    subtitle?: string;
    linkUrl: string;
    linkText: string;
    backgroundColor?: string;
  };
}

export interface ProductCard {
  shopifyId: string;
  title: string;
  imageUrl: string;
  price: string;
  handle: string;
}

export interface ProductCardsBlock extends BaseBlock {
  type: 'product-cards';
  data: {
    heading?: string;
    products: ProductCard[];
    buttonStyle: 'ver-no-site' | 'saiba-mais';
    buttonText: string;
  };
}

export interface AboutStoreBlock extends BaseBlock {
  type: 'about-store';
  data: {
    title: string;
    description: string;
    imageUrls: string[];
    buttonText: string;
    buttonUrl: string;
  };
}

export type ContentBlock = 
  | TitleBlock 
  | ImageBlock 
  | TextBlock 
  | BannerLinkBlock 
  | ProductCardsBlock 
  | AboutStoreBlock;

export function createBlock(type: BlockType, order: number): ContentBlock {
  const id = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (type) {
    case 'title':
      return { id, type, order, data: { text: '', level: 'h1' } };
    case 'image':
      return { id, type, order, data: { url: '', alt: '' } };
    case 'text':
      return { id, type, order, data: { content: '' } };
    case 'banner-link':
      return { id, type, order, data: { imageUrl: '', title: '', linkUrl: '', linkText: 'Ver mais' } };
    case 'product-cards':
      return { id, type, order, data: { products: [], buttonStyle: 'ver-no-site', buttonText: 'Ver no site' } };
    case 'about-store':
      return { id, type, order, data: { title: 'Sobre a Sagrada Magia', description: '', imageUrls: [], buttonText: 'Visitar a Loja', buttonUrl: 'https://sagradamagia.com' } };
  }
}

export const BLOCK_LABELS: Record<BlockType, { label: string; icon: string; description: string }> = {
  'title': { label: 'Título', icon: '📝', description: 'Título principal ou subtítulo' },
  'image': { label: 'Imagem Banner', icon: '🖼️', description: 'Imagem em destaque' },
  'text': { label: 'Texto', icon: '📄', description: 'Parágrafo de texto' },
  'banner-link': { label: 'Banner com Link', icon: '🔗', description: 'Banner com link para categoria do site' },
  'product-cards': { label: 'Produtos Shopify', icon: '🛍️', description: 'Cards de produtos da loja' },
  'about-store': { label: 'Sobre a Loja', icon: '🏪', description: 'Bloco sobre a Sagrada Magia' },
};
