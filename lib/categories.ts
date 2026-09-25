export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
}

export const categories: Category[] = [
  {
    name: 'Meditação & Mindfulness',
    slug: 'meditacao',
    icon: '🧘',
    description: 'Técnicas e práticas de meditação para equilíbrio mental e espiritual',
    count: 12,
  },
  {
    name: 'Cristais & Gemas',
    slug: 'cristais',
    icon: '💎',
    description: 'Propriedades curativas e energéticas dos cristais',
    count: 18,
  },
  {
    name: 'Tarô & Oráculos',
    slug: 'tarot',
    icon: '🔮',
    description: 'Interpretações e guias práticos de tarô',
    count: 15,
  },
  {
    name: 'Rituais Sagrados',
    slug: 'rituais',
    icon: '🕯️',
    description: 'Rituais ancestrais e modernos para transformação',
    count: 10,
  },
  {
    name: 'Astrologia',
    slug: 'astrologia',
    icon: '✨',
    description: 'Influências cósmicas e mapa astral',
    count: 14,
  },
  {
    name: 'Aromaterapia',
    slug: 'aromaterapia',
    icon: '🌸',
    description: 'Óleos essenciais e seus benefícios',
    count: 8,
  },
  {
    name: 'Espiritualidade',
    slug: 'espiritualidade',
    icon: '☮️',
    description: 'Reflexões e ensinamentos espirituais',
    count: 20,
  },
  {
    name: 'Numerologia',
    slug: 'numerologia',
    icon: '🔢',
    description: 'Significados e interpretações numéricas',
    count: 9,
  },
  {
    name: 'Energia',
    slug: 'energia',
    icon: '⚡',
    description: 'Práticas energéticas, limpeza e equilíbrio vibracional',
    count: 0,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}
