import { NextRequest, NextResponse } from "next/server";

// Mock data for development - replace with actual N8N endpoint data
const mockArticles: TechCrunchArticle[] = [
  {
    id: "1",
    title: "Some on social media say taping your mouth shut is a sleep hack. But it's not backed by science, and health risks include suffocation",
    url: "https://fortune.com/section/health/",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    content: "Some on social media say taping your mouth shut is a sleep hack. But it's not backed by science, and health risks include suffocation...",
    created_at: "2024-09-27T10:30:00Z",
    publishedAt: new Date("2024-09-27T10:30:00Z"),
    author: "Kenya Hunter",
    category: "Health",
    readTime: 5,
    summary: "Health experts warn against dangerous sleep hacks promoted on social media platforms."
  },
  {
    id: "2", 
    title: "The 5 Best Testosterone Boosters of 2025: Tested and Reviewed",
    url: "https://fortune.com/section/health/",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    content: "Our comprehensive review of the top testosterone boosters available in 2025...",
    created_at: "2024-09-26T14:15:00Z",
    publishedAt: new Date("2024-09-26T14:15:00Z"),
    author: "Christina Snyder",
    category: "Health",
    readTime: 7,
    summary: "Expert-tested review of testosterone boosters for optimal health and performance."
  },
  {
    id: "3",
    title: "The Best Probiotic Supplements for Women (2025): Expert Approved",
    url: "https://fortune.com/section/health/",
    image: "https://images.unsplash.com/photo-1556909184-f23847fb0530?w=800&q=80",
    content: "Our experts have reviewed the best probiotic supplements specifically formulated for women...",
    created_at: "2024-09-26T09:45:00Z",
    publishedAt: new Date("2024-09-26T09:45:00Z"),
    author: "Christina Snyder",
    category: "Health",
    readTime: 4,
    summary: "Expert-approved probiotic supplements designed to support women's health and wellness."
  },
  {
    id: "4",
    title: "Trump told pregnant women to 'tough it out' instead of take Tylenol. A study of 2.5 million births in Sweden finds zero evidence to back him up",
    url: "https://fortune.com/section/health/",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
    content: "A comprehensive Swedish study of 2.5 million births challenges recent political claims about Tylenol use during pregnancy...",
    created_at: "2024-09-25T16:20:00Z",
    publishedAt: new Date("2024-09-25T16:20:00Z"),
    author: "Renee Gardner",
    category: "Health",
    readTime: 6,
    summary: "Large-scale Swedish study provides evidence against recent claims about Tylenol and pregnancy."
  }
];

// Function to calculate read time based on content
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Function to generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
}

// Function to normalize article data from N8N response
function normalizeArticle(rawArticle: any): TechCrunchArticle {
  const id = rawArticle.url ? btoa(rawArticle.url).slice(0, 16) : Math.random().toString(36).substr(2, 9);
  const publishedAt = rawArticle.created_at ? new Date(rawArticle.created_at) : new Date();
  const content = rawArticle.content || "";
  const readTime = content ? calculateReadTime(content) : Math.floor(Math.random() * 8) + 2;
  const summary = content ? generateExcerpt(content) : "";

  return {
    id,
    title: rawArticle.title || "Untitled Article",
    url: rawArticle.url || "#",
    image: rawArticle.image || rawArticle.thumbnail,
    thumbnail: rawArticle.thumbnail || rawArticle.image,
    content,
    created_at: rawArticle.created_at || new Date().toISOString(),
    publishedAt,
    author: rawArticle.author || "Fortune Staff",
    category: rawArticle.category || "Technology",
    readTime,
    summary: rawArticle.summary || summary
  };
}

// Function to fetch from N8N webhook
async function fetchFromN8N(limit: number = 20): Promise<TechCrunchArticle[]> {
  const n8nEndpoint = process.env.N8N_TECHCRUNCH_ENDPOINT;
  
  if (!n8nEndpoint) {
    console.warn("N8N_TECHCRUNCH_ENDPOINT not configured, using mock data");
    return mockArticles.slice(0, limit);
  }

  try {
    const response = await fetch(n8nEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Yum-mi/1.0'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`N8N endpoint responded with status: ${response.status}`);
    }

    const rawData = await response.json();
    
    // Handle different response formats from N8N
    const articles = Array.isArray(rawData) ? rawData : rawData.articles || rawData.data || [];
    
    return articles
      .slice(0, limit)
      .map(normalizeArticle)
      .filter((article: TechCrunchArticle) => article.title && article.url);
      
  } catch (error) {
    console.error("Error fetching from N8N endpoint:", error);
    // Fallback to mock data on error
    return mockArticles.slice(0, limit);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 items
    const offset = (page - 1) * limit;

    // Fetch articles from N8N or use mock data
    const allArticles = await fetchFromN8N(50); // Fetch more for pagination
    
    // Apply pagination
    const articles = allArticles.slice(offset, offset + limit);
    const hasMore = offset + limit < allArticles.length;

    const response: TechCrunchApiResponse = {
      articles,
      total: allArticles.length,
      page,
      limit,
      hasMore
    };

    // Set cache headers for performance
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
    });

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error("API Error:", error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to fetch articles", 
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
