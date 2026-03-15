import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/database";

interface BlogCardProps {
  post: BlogPost;
  locale: string;
  readMoreText: string;
}

export default function BlogCard({ post, locale, readMoreText }: BlogCardProps) {
  const isEn = locale === "en";
  const title = isEn ? post.title_en : post.title_cs;
  const excerpt = isEn ? post.excerpt_en : post.excerpt_cs;

  return (
    <article className="bg-white transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
      {post.cover_image_url && (
        <div className="relative w-full h-[200px]">
          <Image
            src={post.cover_image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-[25px] text-center">
        {post.tags.length > 0 && (
          <div className="flex gap-2 mb-2 justify-center">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[0.75rem] text-secondary uppercase tracking-[1px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="my-[10px] text-[1.3rem]">{title}</h3>
        {excerpt && (
          <p className="text-[0.9rem] text-secondary mb-[15px]">{excerpt}</p>
        )}
        {post.source === "rss" && post.story_data?.source_url ? (
          <a
            href={post.story_data.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.85rem] uppercase tracking-[1px] font-semibold"
          >
            {post.story_data.source_name || "Source"} &rarr;
          </a>
        ) : (
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="text-[0.85rem] uppercase tracking-[1px] font-semibold"
          >
            {readMoreText} &rarr;
          </Link>
        )}
      </div>
    </article>
  );
}
