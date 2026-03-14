import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-12 mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-stone-800 mb-4">
          Vår families historier
        </h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed">
          Her samler vi familiehistorier, minner, bilder og slektsinformasjon — til glede for alle generasjoner.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link href="/posts" className="bg-warm-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-warm-700 transition-colors">
            Les bloggen
          </Link>
          <Link href="/family-tree" className="border border-warm-300 text-warm-700 px-6 py-2.5 rounded-lg font-medium hover:bg-warm-50 transition-colors">
            Utforsk slektstreet
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-stone-800">
            Siste innlegg
          </h2>
          <Link href="/posts" className="text-sm text-warm-600 hover:text-warm-800 font-medium transition-colors">
            Se alle →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-warm-200">
            <p className="text-stone-400 text-lg font-serif italic mb-4">Ingen innlegg ennå.</p>
            <Link href="/keystatic" className="text-warm-600 hover:underline text-sm">
              Skriv det første innlegget i Admin-panelet →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/gallery" className="bg-white border border-warm-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-2">📷</div>
          <h3 className="font-serif font-semibold text-stone-800 group-hover:text-warm-700 transition-colors">Bildegalleri</h3>
          <p className="text-sm text-stone-500 mt-1">Familiebilder og album</p>
        </Link>
        <Link href="/family-tree" className="bg-white border border-warm-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-2">🌳</div>
          <h3 className="font-serif font-semibold text-stone-800 group-hover:text-warm-700 transition-colors">Slektstre</h3>
          <p className="text-sm text-stone-500 mt-1">Utforsk familiehistorien</p>
        </Link>
        <Link href="/keystatic" className="bg-white border border-warm-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-2">✏️</div>
          <h3 className="font-serif font-semibold text-stone-800 group-hover:text-warm-700 transition-colors">Admin</h3>
          <p className="text-sm text-stone-500 mt-1">Rediger innhold</p>
        </Link>
      </section>
    </div>
  );
}
