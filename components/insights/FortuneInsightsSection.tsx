"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import FortuneArticleCard from "./FortuneArticleCard";
import { ArticleGridSkeleton } from "./ArticleCardSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fortuneHealthTokens, fortuneHealthCSSVars } from "@/lib/design-tokens/fortune-health";

interface InsightsSectionState {
  articles: TechCrunchArticle[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  total: number;
}

const FortuneInsightsSection = ({ 
  initialArticles = [], 
  className 
}: { 
  initialArticles?: TechCrunchArticle[]; 
  className?: string; 
}) => {
  const [state, setState] = useState<InsightsSectionState>({
    articles: initialArticles,
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    total: 0
  });

  // Fetch articles from API
  const fetchArticles = useCallback(async (page: number = 1, append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(`/api/techcrunch?page=${page}&limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TechCrunchApiResponse = await response.json();
      
      setState(prev => ({
        ...prev,
        articles: append ? [...prev.articles, ...data.articles] : data.articles,
        loading: false,
        page: data.page,
        hasMore: data.hasMore,
        total: data.total,
        error: null
      }));

      // Track analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'insights_loaded', {
          event_category: 'content',
          event_label: 'fortune_health_articles',
          value: data.articles.length
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch articles';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      toast.error('Failed to load articles. Please try again.');
      console.error('Error fetching articles:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (initialArticles.length === 0) {
      fetchArticles(1);
    }
  }, [fetchArticles, initialArticles.length]);

  // Load more articles (pagination)
  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      fetchArticles(state.page + 1, true);
    }
  }, [fetchArticles, state.loading, state.hasMore, state.page]);

  // Retry on error
  const retry = useCallback(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  // Track article clicks
  const trackArticleClick = useCallback((article: TechCrunchArticle) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'article_click', {
        event_category: 'engagement',
        event_label: article.title,
        value: 1
      });
    }
  }, []);

  return (
    <section 
      className={cn("py-20 bg-white", className)}
      style={fortuneHealthCSSVars as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header - Fortune Health Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          viewport={{ once: true }}
          className="mb-16"
        >
          {/* Main Title */}
          <h1 
            className="text-5xl lg:text-6xl font-bold text-black mb-6 leading-none tracking-tight"
            style={{
              fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
              fontWeight: fortuneHealthTokens.typography.fontWeights.bold,
              letterSpacing: fortuneHealthTokens.typography.letterSpacing.tighter,
              color: fortuneHealthTokens.colors.brand.primary
            }}
          >
            More Health
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8"
            style={{
              fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
              fontSize: fortuneHealthTokens.typography.fontSizes.xl,
              color: fortuneHealthTokens.colors.text.secondary,
              lineHeight: fortuneHealthTokens.typography.lineHeights.relaxed
            }}
          >
            The latest health news, expert insights, and wellness trends from Fortune&apos;s health coverage.
          </p>

          {/* Article Count */}
          {state.total > 0 && (
            <p 
              className="text-sm text-gray-500 border-t border-gray-200 pt-4"
              style={{
                fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                fontSize: fortuneHealthTokens.typography.fontSizes.sm,
                color: fortuneHealthTokens.colors.text.tertiary
              }}
            >
              {state.articles.length} of {state.total} articles
            </p>
          )}
        </motion.div>

        {/* Error State */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 max-w-2xl"
          >
            <div className="bg-red-50 border border-red-200 p-8">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 
                    className="text-lg font-bold text-red-900 mb-2"
                    style={{
                      fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                      fontWeight: fortuneHealthTokens.typography.fontWeights.bold
                    }}
                  >
                    Unable to Load Articles
                  </h3>
                  <p 
                    className="text-red-700 mb-4"
                    style={{
                      fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                      color: fortuneHealthTokens.colors.status.error
                    }}
                  >
                    {state.error}
                  </p>
                  <Button
                    onClick={retry}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 font-semibold"
                    disabled={state.loading}
                    style={{
                      fontFamily: fortuneHealthTokens.typography.fontFamilies.primary
                    }}
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-2", state.loading && "animate-spin")} />
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {state.loading && state.articles.length === 0 && (
          <div className="mb-16">
            <ArticleGridSkeleton count={6} />
          </div>
        )}

        {/* Articles Grid - Fortune Health Layout */}
        {state.articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {/* Featured Article (First Article) */}
            {state.articles[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="border-b border-gray-200 pb-16"
              >
                <div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  onClick={() => trackArticleClick(state.articles[0])}
                >
                  <div className="order-2 lg:order-1 space-y-6">
                    {/* Category */}
                    {state.articles[0].category && (
                      <span 
                        className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-black text-white"
                        style={{
                          fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                          fontSize: fortuneHealthTokens.typography.fontSizes.xs,
                          fontWeight: fortuneHealthTokens.typography.fontWeights.semibold,
                          letterSpacing: fortuneHealthTokens.typography.letterSpacing.wider
                        }}
                      >
                        {state.articles[0].category}
                      </span>
                    )}

                    {/* Featured Title */}
                    <h2>
                      <Link
                        href={state.articles[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-4xl lg:text-5xl font-bold leading-tight text-black hover:text-red-600 transition-colors duration-200"
                        style={{
                          fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                          fontWeight: fortuneHealthTokens.typography.fontWeights.bold,
                          lineHeight: fortuneHealthTokens.typography.lineHeights.tight,
                          letterSpacing: fortuneHealthTokens.typography.letterSpacing.tight
                        }}
                      >
                        {state.articles[0].title}
                      </Link>
                    </h2>

                    {/* Featured Summary */}
                    {state.articles[0].summary && (
                      <p 
                        className="text-xl text-gray-600 leading-relaxed"
                        style={{
                          fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                          fontSize: fortuneHealthTokens.typography.fontSizes.xl,
                          color: fortuneHealthTokens.colors.text.secondary,
                          lineHeight: fortuneHealthTokens.typography.lineHeights.relaxed
                        }}
                      >
                        {state.articles[0].summary}
                      </p>
                    )}

                    {/* Featured Meta */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {state.articles[0].author && (
                        <span 
                          className="font-medium text-black"
                          style={{
                            fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                            fontWeight: fortuneHealthTokens.typography.fontWeights.medium
                          }}
                        >
                          {state.articles[0].author}
                        </span>
                      )}
                      <time dateTime={state.articles[0].created_at}>
                        {format(new Date(state.articles[0].publishedAt), "MMM d, yyyy")}
                      </time>
                      {state.articles[0].readTime && (
                        <span>{state.articles[0].readTime} min read</span>
                      )}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="order-1 lg:order-2">
                    {state.articles[0].image && (
                      <Link
                        href={state.articles[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={state.articles[0].image}
                            alt={state.articles[0].title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                          />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular Articles Grid */}
            {state.articles.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {state.articles.slice(1).map((article, index) => (
                  <div 
                    key={article.id} 
                    onClick={() => trackArticleClick(article)}
                  >
                    <FortuneArticleCard
                      article={article}
                      index={index + 1}
                      priority={index < 2}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Load More Button - Fortune Style */}
        {state.hasMore && state.articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center border-t border-gray-200 pt-16"
          >
            <Button
              onClick={loadMore}
              disabled={state.loading}
              size="lg"
              variant="outline"
              className={cn(
                "px-8 py-4 font-semibold transition-all duration-300",
                "border-black text-black hover:bg-black hover:text-white",
                "text-base tracking-wide",
                state.loading && "cursor-not-allowed opacity-50"
              )}
              style={{
                fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                fontWeight: fortuneHealthTokens.typography.fontWeights.semibold,
                letterSpacing: fortuneHealthTokens.typography.letterSpacing.wide
              }}
            >
              {state.loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                  Loading More Stories...
                </>
              ) : (
                <>
                  Load More Stories
                  <ArrowRight className="h-5 w-5 ml-3" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {!state.loading && state.articles.length === 0 && !state.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <h3 
              className="text-2xl font-bold text-black mb-4"
              style={{
                fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                fontWeight: fortuneHealthTokens.typography.fontWeights.bold
              }}
            >
              No Stories Available
            </h3>
            <p 
              className="text-lg text-gray-600 max-w-md mx-auto"
              style={{
                fontFamily: fortuneHealthTokens.typography.fontFamilies.primary,
                color: fortuneHealthTokens.colors.text.secondary
              }}
            >
              We&apos;re working on bringing you the latest health insights. 
              Please check back soon.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FortuneInsightsSection;
