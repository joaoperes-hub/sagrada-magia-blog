'use client';
import React, { useRef, useState } from 'react';

export type UploadPurpose = 'hero' | 'thumbnail' | 'content' | 'banner' | 'about';

interface Props {
  value: string;
  onChange: (url: string) => void;
  purpose?: UploadPurpose;
  label?: string;
  preview?: 'default' | 'banner' | 'square';
  showUrlInput?: boolean;
}

const PURPOSE_HINTS: Record<UploadPurpose, string> = {
  hero: 'Hero/Carrossel · 2400×1000 (ratio 12:5) · até ~400KB',
  thumbnail: 'Thumbnail/Capa · 1600×1067 (3:2) · até ~250KB',
  content: 'Imagem da matéria · lado maior 1600px · até ~300KB',
  banner: 'Banner link · 1600×600 (banner alongado) · até ~250KB',
  about: 'Prova social · 800×800 (quadrada) · até ~150KB',
};

export default function ImageUploader({
  value,
  onChange,
  purpose = 'content',
  label,
  preview = 'default',
  showUrlInput = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', purpose);

      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro no upload');
      onChange(data.url);
    } catch (e: any) {
      setError(e.message || 'Falhou');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const previewClasses =
    preview === 'banner'
      ? 'w-full max-h-48 object-cover'
      : preview === 'square'
      ? 'w-full h-20 object-cover rounded'
      : 'w-full max-h-64 object-cover';

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-amiko text-gray-700">{label}</label>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-sagrada-magenta text-white rounded-lg font-amiko text-sm hover:bg-sagrada-magenta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Enviando...' : (value ? '🔄 Trocar imagem' : '📤 Fazer upload')}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-2 text-gray-500 hover:text-red-500 text-sm font-amiko"
          >
            Remover
          </button>
        )}
        <span className="text-xs text-gray-500 font-niramit">{PURPOSE_HINTS[purpose]}</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {showUrlInput && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…ou cole uma URL (https://...)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sagrada-magenta font-niramit text-sm"
        />
      )}

      {error && (
        <p className="text-red-500 text-xs font-niramit">⚠️ {error}</p>
      )}

      {value && !uploading && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="Preview" className={previewClasses} />
        </div>
      )}
    </div>
  );
}
