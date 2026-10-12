'use client';
import React from 'react';
import { TitleBlock } from '@/lib/block-types';

interface Props {
  block: TitleBlock;
  onChange: (data: TitleBlock['data']) => void;
}

export default function TitleBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={block.data.text}
        onChange={(e) => onChange({ ...block.data, text: e.target.value })}
        placeholder="Digite o título..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-amiko text-xl"
      />
      <div className="flex gap-2">
        {(['h1', 'h2', 'h3'] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange({ ...block.data, level })}
            className={`px-3 py-1 rounded text-sm font-amiko transition-colors ${
              block.data.level === level
                ? 'bg-sagrada-magenta text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
