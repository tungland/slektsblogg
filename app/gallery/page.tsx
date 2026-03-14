import fs from "fs";
import path from "path";
import PhotoGallery, { PhotoItem } from "@/components/PhotoGallery";
import Link from "next/link";

function getPhotos(): PhotoItem[] {
  const photosDir = path.join(process.cwd(), "public/photos");
  if (!fs.existsSync(photosDir)) return [];

  const photos: PhotoItem[] = [];
  const albums = fs.readdirSync(photosDir, { withFileTypes: true });

  for (const entry of albums) {
    if (entry.isDirectory()) {
      const albumName = entry.name;
      const albumPath = path.join(photosDir, albumName);
      const files = fs.readdirSync(albumPath).filter((f) =>
        /\.(jpe?g|png|gif|webp|avif)$/i.test(f)
      );
      for (const file of files) {
        photos.push({
          src: `/photos/${albumName}/${file}`,
          alt: file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          album: albumName,
        });
      }
    } else if (entry.isFile() && /\.(jpe?g|png|gif|webp|avif)$/i.test(entry.name)) {
      photos.push({
        src: `/photos/${entry.name}`,
        alt: entry.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      });
    }
  }

  return photos;
}

export default function GalleryPage() {
  const photos = getPhotos();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">Bildegalleri</h1>
        <p className="text-stone-500">Familiebilder gjennom tidene</p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-warm-200">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-stone-400 text-lg font-serif italic mb-2">Ingen bilder ennå.</p>
          <p className="text-stone-400 text-sm">
            Legg til bilder i <code className="bg-warm-100 px-1 rounded">public/photos/</code> for å vise dem her.
          </p>
          <Link href="/keystatic" className="mt-4 inline-block text-warm-600 hover:underline text-sm">
            Administrer bilder i Admin-panelet →
          </Link>
        </div>
      ) : (
        <PhotoGallery photos={photos} />
      )}
    </div>
  );
}
