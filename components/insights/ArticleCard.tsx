"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ArticleCard = ({ article, index = 0, priority = false }: ArticleCardProps) => {
  const formattedDate = format(new Date(article.publishedAt), "MMM d, yyyy");
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Article Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {article.image ? (
          <Link 
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative h-full w-full"
            aria-label={`Read article: ${article.title}`}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <ExternalLink className="h-12 w-12 text-emerald-400" />
          </div>
        )}
        
        {/* Category Tag */}
        {article.category && (
          <div className="absolute top-3 left-3 z-10">
            <span 
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 rounded-full border border-gray-200"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              }}
            >
              {article.category}
            </span>
          </div>
        )}

        {/* External Link Indicator */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200">
            <ExternalLink className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6 space-y-4">
        {/* Article Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.created_at}>
              {formattedDate}
            </time>
          </div>
          
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
          )}

          {article.author && (
            <div className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3" />
              <span className="truncate max-w-20">{article.author}</span>
            </div>
          )}
        </div>

        {/* Article Title */}
        <h3 className="group">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-xl font-bold leading-tight text-gray-900",
              "group-hover:text-emerald-700 transition-colors duration-200",
              "line-clamp-2 display-block"
            )}
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.01em'
            }}
          >
            {article.title}
          </Link>
        </h3>

        {/* Article Summary/Excerpt */}
        {article.summary && (
          <p 
            className="text-gray-600 leading-relaxed line-clamp-3"
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '400',
              lineHeight: '1.6'
            }}
          >
            {article.summary}
          </p>
        )}

        {/* Read More Link */}
        <div className="pt-2">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold",
              "text-emerald-600 hover:text-emerald-700",
              "transition-colors duration-200",
              "group-hover:gap-3"
            )}
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            Read full article
            <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.summary,
            url: article.url,
            datePublished: article.created_at,
            author: {
              "@type": "Person",
              name: article.author || "TechCrunch"
            },
            publisher: {
              "@type": "Organization",
              name: "TechCrunch",
              logo: {
                "@type": "ImageObject",
                url: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png"
              }
            },
            image: article.image,
            articleSection: article.category
          })
        }}
      />
    </motion.article>
  );
};

export default ArticleCard;
