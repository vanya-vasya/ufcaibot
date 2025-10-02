"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";

import ArticleCard from "./ArticleCard";
import { ArticleGridSkeleton } from "./ArticleCardSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InsightsSectionState {
  articles: TechCrunchArticle[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  total: number;
}

const InsightsSection = ({ 
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
          event_label: 'techcrunch_articles',
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
    <section className={cn("py-16 bg-gray-50", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <h2 
              className="text-3xl lg:text-4xl font-bold text-gray-900"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '800',
                letterSpacing: '-0.02em'
              }}
            >
              Latest Insights
            </h2>
          </div>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '400'
            }}
          >
            Stay up-to-date with the latest trends and innovations in food technology, 
            nutrition science, and AI-powered wellness solutions.
          </p>
          {state.total > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              Showing {state.articles.length} of {state.total} articles
            </p>
          )}
        </motion.div>

        {/* Error State */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Unable to Load Articles
              </h3>
              <p className="text-red-700 mb-4">
                {state.error}
              </p>
              <Button
                onClick={retry}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                disabled={state.loading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", state.loading && "animate-spin")} />
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {state.loading && state.articles.length === 0 && (
          <ArticleGridSkeleton count={6} />
        )}

        {/* Articles Grid */}
        {state.articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {state.articles.map((article, index) => (
              <div 
                key={article.id} 
                onClick={() => trackArticleClick(article)}
              >
                <ArticleCard
                  article={article}
                  index={index}
                  priority={index < 3} // Prioritize first 3 images for performance
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Load More Button */}
        {state.hasMore && state.articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              onClick={loadMore}
              disabled={state.loading}
              size="lg"
              variant="outline"
              className={cn(
                "px-8 py-3 font-semibold transition-all duration-300",
                "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
                "hover:border-emerald-300 hover:scale-105 active:scale-95",
                state.loading && "cursor-not-allowed opacity-50"
              )}
            >
              {state.loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Loading More...
                </>
              ) : (
                <>
                  Load More Articles
                  <TrendingUp className="h-5 w-5 ml-2" />
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
            className="text-center py-16"
          >
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Articles Available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We&apos;re working on bringing you the latest insights. 
              Please check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default InsightsSection;
