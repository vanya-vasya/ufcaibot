"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fortuneHealthTokens } from "@/lib/design-tokens/fortune-health";

const FortuneArticleCard = ({ article, index = 0 }: Omit<ArticleCardProps, 'priority'>) => {
  const formattedDate = format(new Date(article.publishedAt), "MMM d, yyyy");
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98] // Custom Fortune-like easing
      }}
      viewport={{ once: true, margin: "-30px" }}
      className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300"
      style={{
        fontFamily: fortuneHealthTokens.typography.fontFamilies.primary
      }}
    >
      {/* Article Content */}
      <div className="p-8 space-y-6">
        {/* Category Tag - Fortune style */}
        {article.category && (
          <div className="mb-4">
            <span 
              className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-black text-white"
              style={{
                fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                fontSize: fortuneHealthTokens.typography.fontSizes.xs,
                fontWeight: fortuneHealthTokens.typography.fontWeights.semibold,
                letterSpacing: fortuneHealthTokens.typography.letterSpacing.wider
              }}
            >
              {article.category}
            </span>
          </div>
        )}

        {/* Article Title - Fortune typography */}
        <h3>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block text-xl font-bold leading-tight text-black",
              "transition-colors duration-200",
              "line-clamp-3"
            )}
            style={{
              fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
              fontSize: fortuneHealthTokens.typography.fontSizes['2xl'],
              fontWeight: fortuneHealthTokens.typography.fontWeights.bold,
              lineHeight: fortuneHealthTokens.typography.lineHeights.tight,
              letterSpacing: fortuneHealthTokens.typography.letterSpacing.tight
            }}
          >
            {article.title}
          </Link>
        </h3>

        {/* Article Summary - Fortune style */}
        {article.summary && (
          <p 
            className="text-gray-600 leading-relaxed line-clamp-3"
            style={{
              fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
              fontSize: fortuneHealthTokens.typography.fontSizes.base,
              fontWeight: fortuneHealthTokens.typography.fontWeights.normal,
              lineHeight: fortuneHealthTokens.typography.lineHeights.relaxed,
              color: fortuneHealthTokens.colors.text.secondary
            }}
          >
            {article.summary}
          </p>
        )}

        {/* Article Meta - Fortune style */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm font-medium text-black"
                  style={{
                    fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                    fontSize: fortuneHealthTokens.typography.fontSizes.sm,
                    fontWeight: fortuneHealthTokens.typography.fontWeights.medium
                  }}
                >
                  {article.author}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-1">
              <time 
                dateTime={article.created_at}
                className="text-sm text-gray-500"
                style={{
                  fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                  fontSize: fortuneHealthTokens.typography.fontSizes.sm,
                  color: fortuneHealthTokens.colors.text.tertiary
                }}
              >
                {formattedDate}
              </time>
            </div>
          </div>

          {/* Read Time */}
          {article.readTime && (
            <div className="flex items-center gap-1">
              <span 
                className="text-sm text-gray-500"
                style={{
                  fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                  fontSize: fortuneHealthTokens.typography.fontSizes.sm,
                  color: fortuneHealthTokens.colors.text.tertiary
                }}
              >
                {article.readTime} min read
              </span>
            </div>
          )}
        </div>

        {/* Read More Link - Fortune style */}
        <div className="pt-2">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold",
              "text-black",
              "transition-all duration-200",
              "group-hover:gap-3"
            )}
            style={{
              fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
              fontSize: fortuneHealthTokens.typography.fontSizes.sm,
              fontWeight: fortuneHealthTokens.typography.fontWeights.semibold
            }}
          >
            Read More
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        data-testid="article-json-ld"
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
              name: article.author || "Fortune"
            },
            publisher: {
              "@type": "Organization",
              name: "Fortune",
              logo: {
                "@type": "ImageObject",
                url: "https://fortune.com/wp-content/uploads/2018/04/fortune-logo-black-square.png"
              }
            },
            articleSection: article.category
          })
        }}
      />
    </motion.article>
  );
};

export default FortuneArticleCard;
