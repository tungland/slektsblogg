import { getPostBySlug, getAllPosts, formatNorwegianDate } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

const mdxComponents = {
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} className="rounded-lg my-4 max-w-full h-auto" alt={props.alt ?? ""} />
  ),
};

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/posts" className="text-sm text-warm-600 hover:text-warm-800 transition-colors mb-4 inline-block">
          ← Tilbake til blogg
        </Link>
        <h1 className="font-serif text-4xl font-semibold text-stone-800 mb-3 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-stone-400">
          <time dateTime={post.date}>{formatNorwegianDate(post.date)}</time>
          {post.author && (
            <>
              <span>·</span>
              <span>{post.author}</span>
            </>
          )}
        </div>
      </div>

      {post.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={450}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-a:text-warm-600 prose-a:no-underline hover:prose-a:underline">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
