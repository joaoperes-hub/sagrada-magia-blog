'use client';
import React from 'react';
import { TextBlock } from '@/lib/block-types';

interface Props {
  block: TextBlock;
  onChange: (data: TextBlock['data']) => void;
}

export default function TextBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1 mb-1">
        <button
          type="button"
          onClick={() => {
            const textarea = document.getElementById(`text-${block.id}`) as HTMLTextAreaElement;
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selected = textarea.value.substring(start, end);
              const newContent = textarea.value.substring(0, start) + `<strong>${selected}</strong>` + textarea.value.substring(end);
              onChange({ content: newContent });
            }
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold transition-colors"
          title="Negrito"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => {
            const textarea = document.getElementById(`text-${block.id}`) as HTMLTextAreaElement;
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selected = textarea.value.substring(start, end);
              const newContent = textarea.value.substring(0, start) + `<em>${selected}</em>` + textarea.value.substring(end);
              onChange({ content: newContent });
            }
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm italic transition-colors"
          title="Itálico"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('URL do link:');
            if (url) {
              const textarea = document.getElementById(`text-${block.id}`) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selected = textarea.value.substring(start, end) || 'texto do link';
                const newContent = textarea.value.substring(0, start) + `<a href="${url}" target="_blank">${selected}</a>` + textarea.value.substring(end);
                onChange({ content: newContent });
              }
            }
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
          title="Link"
        >
          🔗
        </button>
      </div>
      <textarea
        id={`text-${block.id}`}
        value={block.data.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Escreva o texto aqui... (HTML suportado: <p>, <strong>, <em>, <a>, <ul>, <li>)"
        rows={8}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit resize-y"
      />
    </div>
  );
}
