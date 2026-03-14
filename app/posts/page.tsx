import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">Blogg</h1>
        <p className="text-stone-500">Familiehistorier og minner</p>
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
    </div>
  );
}
