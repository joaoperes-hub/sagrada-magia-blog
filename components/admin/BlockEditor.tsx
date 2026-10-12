'use client';
import React, { useState } from 'react';
import { ContentBlock, BlockType, createBlock, BLOCK_LABELS } from '@/lib/block-types';
import TitleBlockEditor from './blocks/TitleBlockEditor';
import ImageBlockEditor from './blocks/ImageBlockEditor';
import TextBlockEditor from './blocks/TextBlockEditor';
import BannerLinkBlockEditor from './blocks/BannerLinkBlockEditor';
import ProductCardsBlockEditor from './blocks/ProductCardsBlockEditor';
import AboutStoreBlockEditor from './blocks/AboutStoreBlockEditor';

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);

  const addBlock = (type: BlockType, position: number) => {
    const newBlock = createBlock(type, position);
    const updated = [...blocks];
    updated.splice(position, 0, newBlock);
    // Reorder
    updated.forEach((b, i) => (b.order = i));
    onChange(updated);
    setShowAddMenu(null);
  };

  const updateBlock = (id: string, data: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, data } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id).map((b, i) => ({ ...b, order: i })));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const updated = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((b, i) => (b.order = i));
    onChange(updated);
  };

  const renderBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'title':
        return <TitleBlockEditor block={block} onChange={(data) => updateBlock(block.id, data)} />;
      case 'image':
        return <ImageBlockEditor block={block} onChange={(data) => updateBlock(block.id, data)} />;
      case 'text':
        return <TextBlockEditor block={block} onChange={(data) => updateBlock(block.id, data)} />;
      case 'banner-link':
        return <BannerLinkBlockEditor block={block} onChange={(data) => updateBlock(block.id, data)} />;
      case 'product-cards':
        return <ProductCardsBlockEditor block={block} onChange={(data) => updateBlock(block.id, data)} />;
      case 'about-store':
        return <AboutStoreBlockEditor block={block} onChange={(data) => updateBlock(block.id, data)} />;
    }
  };

  const AddBlockButton = ({ position }: { position: number }) => (
    <div className="relative flex items-center justify-center py-2">
      <button
        type="button"
        onClick={() => setShowAddMenu(showAddMenu === position ? null : position)}
        className="w-8 h-8 rounded-full bg-sagrada-magenta/10 text-sagrada-magenta hover:bg-sagrada-magenta hover:text-white transition-all duration-200 flex items-center justify-center text-lg font-bold"
      >
        +
      </button>
      {showAddMenu === position && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-2 min-w-[260px]">
          {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type, position)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sagrada-magenta/5 rounded-lg transition-colors text-left"
            >
              <span className="text-xl">{BLOCK_LABELS[type].icon}</span>
              <div>
                <p className="font-amiko text-sm font-semibold text-sagrada-black">{BLOCK_LABELS[type].label}</p>
                <p className="text-xs text-gray-500 font-niramit">{BLOCK_LABELS[type].description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-1">
      <AddBlockButton position={0} />

      {blocks.map((block, index) => (
        <React.Fragment key={block.id}>
          <div className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-sagrada-magenta/30 transition-colors">
            {/* Block header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">{BLOCK_LABELS[block.type].icon}</span>
                <span className="font-amiko text-sm font-semibold text-sagrada-magenta-dark">
                  {BLOCK_LABELS[block.type].label}
                </span>
                <span className="text-xs text-gray-400 font-niramit">#{index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                  title="Mover para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                  title="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Remover este bloco?')) removeBlock(block.id);
                  }}
                  className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors ml-2"
                  title="Remover bloco"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Block content */}
            {renderBlockEditor(block)}
          </div>

          <AddBlockButton position={index + 1} />
        </React.Fragment>
      ))}

      {blocks.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-niramit text-lg mb-2">Nenhum bloco adicionado</p>
          <p className="text-gray-400 font-niramit text-sm">Clique no + acima para começar a montar sua matéria</p>
        </div>
      )}
    </div>
  );
}
