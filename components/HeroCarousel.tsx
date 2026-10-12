'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Slide {
  type: 'default' | 'post';
  title: string;
  subtitle: string;
  image?: string;
  link: string;
  linkText: string;
  category?: string;
  categoryIcon?: string;
}

interface Props {
  posts: any[];
}

export default function HeroCarousel({ posts }: Props) {
  const slides: Slide[] = [
    // Slide fixo
    {
      type: 'default',
      title: 'Sagrada Magia',
      subtitle: 'Conteúdo sobre espiritualidade, autoconhecimento e práticas ancestrais para transformar sua jornada interior.',
      link: '/blog',
      linkText: 'Explorar o Blog',
    },
    // Slides dinâmicos dos posts
    ...posts.slice(0, 4).map((post: any) => ({
      type: 'post' as const,
      title: post.title,
      subtitle: post.excerpt,
      image: post.featured_image,
      link: `/blog/${post.slug}`,
      linkText: 'Ler matéria',
      category: post.category_name,
      categoryIcon: post.category_icon,
    })),
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, slides.length, goToSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden min-h-[480px] sm:min-h-[520px]">
      {/* Background */}
      {slide.type === 'post' && slide.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sagrada-cream via-sagrada-pink-light/30 to-sagrada-mint-light/40">
          <div className="absolute top-20 left-10 w-64 h-64 bg-sagrada-magenta/5 blob animate-float" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-sagrada-mint/10 blob" />
          <div className="absolute top-40 right-1/4 w-32 h-32 bg-sagrada-pink/8 rounded-full blur-2xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div
          className="text-center transition-all duration-500"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
          }}
        >
          {slide.type === 'default' ? (
            <>
              <p className="text-sagrada-magenta font-amiko font-semibold tracking-widest uppercase text-sm mb-4">
                Bem-vindo ao universo sagrado
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-amiko font-bold text-sagrada-black leading-tight mb-6">
                Sagrada{' '}
                <span className="text-gradient">Magia</span>
              </h1>
              <p className="text-xl sm:text-2xl text-sagrada-gray-dark font-niramit max-w-2xl mx-auto mb-10 leading-relaxed">
                {slide.subtitle}
              </p>
            </>
          ) : (
            <>
              {slide.category && (
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-amiko font-semibold rounded-full mb-4">
                  {slide.categoryIcon} {slide.category}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-amiko font-bold text-white leading-tight mb-6 max-w-3xl mx-auto">
                {slide.title}
              </h2>
              <p className="text-lg sm:text-xl text-white/85 font-niramit max-w-2xl mx-auto mb-10 leading-relaxed line-clamp-3">
                {slide.subtitle}
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={slide.link}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-amiko font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                slide.type === 'default'
                  ? 'bg-sagrada-magenta hover:bg-sagrada-magenta-dark text-white'
                  : 'bg-white text-sagrada-magenta-dark hover:bg-sagrada-cream'
              }`}
            >
              {slide.linkText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {slide.type === 'default' && (
              <a
                href="https://sagradamagia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur border-2 border-sagrada-magenta/30 text-sagrada-magenta-dark hover:bg-sagrada-magenta hover:text-white hover:border-sagrada-magenta font-amiko font-semibold rounded-full transition-all duration-300"
              >
                Visitar a Loja
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === current
                  ? `w-8 h-2.5 ${slide.type === 'default' ? 'bg-sagrada-magenta' : 'bg-white'}`
                  : `w-2.5 h-2.5 ${slide.type === 'default' ? 'bg-sagrada-magenta/30' : 'bg-white/40'} hover:${slide.type === 'default' ? 'bg-sagrada-magenta/50' : 'bg-white/60'}`
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Nav arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goToSlide((current - 1 + slides.length) % slides.length)}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              slide.type === 'default'
                ? 'bg-sagrada-magenta/10 text-sagrada-magenta hover:bg-sagrada-magenta/20'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={() => goToSlide((current + 1) % slides.length)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              slide.type === 'default'
                ? 'bg-sagrada-magenta/10 text-sagrada-magenta hover:bg-sagrada-magenta/20'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            aria-label="Próximo"
          >
            ›
          </button>
        </>
      )}

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="var(--color-sagrada-cream)" />
        </svg>
      </div>
    </section>
  );
}
