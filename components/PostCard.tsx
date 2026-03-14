import Link from "next/link";
import { PostMeta, formatNorwegianDate } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="bg-white rounded-xl border border-warm-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`} className="block group">
        <h2 className="font-serif text-xl font-semibold text-stone-800 group-hover:text-warm-700 transition-colors mb-2">
          {post.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-stone-400 mb-3">
          <time dateTime={post.date}>{formatNorwegianDate(post.date)}</time>
          {post.author && (
            <>
              <span>·</span>
              <span>{post.author}</span>
            </>
          )}
        </div>
        {post.excerpt && (
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-warm-600 group-hover:text-warm-800 transition-colors">
          Les mer →
        </span>
      </Link>
    </article>
  );
}
