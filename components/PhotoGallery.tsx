"use client";

import Image from "next/image";
import { useState } from "react";

export interface PhotoItem {
  src: string;
  alt: string;
  caption?: string;
  album?: string;
  year?: string;
}

export default function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>("Alle");
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null);

  const albums = ["Alle", ...Array.from(new Set(photos.map((p) => p.album).filter(Boolean) as string[]))];
  const filtered = selectedAlbum === "Alle" ? photos : photos.filter((p) => p.album === selectedAlbum);

  return (
    <div>
      {/* Album filter */}
      {albums.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedAlbum === album
                  ? "bg-warm-600 text-white"
                  : "bg-white border border-warm-200 text-stone-600 hover:bg-warm-50"
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {filtered.map((photo, i) => (
          <div
            key={i}
            className="break-inside-avoid bg-white rounded-lg border border-warm-200 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setLightbox(photo)}
          >
            <div className="relative w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            {(photo.caption || photo.year) && (
              <div className="p-3">
                {photo.caption && <p className="text-sm text-stone-600 font-serif italic">{photo.caption}</p>}
                {photo.year && <p className="text-xs text-stone-400 mt-0.5">{photo.year}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={900}
                height={600}
                className="w-full h-auto"
              />
            </div>
            {(lightbox.caption || lightbox.year) && (
              <div className="p-4">
                {lightbox.caption && <p className="text-stone-700 font-serif italic">{lightbox.caption}</p>}
                {lightbox.year && <p className="text-sm text-stone-400 mt-1">{lightbox.year}</p>}
              </div>
            )}
            <button
              className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-stone-400 font-serif italic">
          Ingen bilder i dette albumet ennå.
        </div>
      )}
    </div>
  );
}
