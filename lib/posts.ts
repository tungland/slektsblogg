import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  coverImage?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function ensurePostsDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

export function getAllPosts(): PostMeta[] {
  ensurePostsDir();
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      author: data.author,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  ensurePostsDir();
  const extensions = [".mdx", ".md"];
  let fullPath = "";

  for (const ext of extensions) {
    const candidate = path.join(postsDirectory, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      fullPath = candidate;
      break;
    }
  }

  if (!fullPath) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: data.author,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    content,
  };
}

export function formatNorwegianDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("nb-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
