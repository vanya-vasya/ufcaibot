import { NextRequest, NextResponse } from "next/server";

// Latest Fortune health articles - updated with real content
const mockArticles: TechCrunchArticle[] = [
  {
    id: "1",
    title: "Some on social media say taping your mouth shut is a sleep hack. But it's not backed by science, and health risks include suffocation",
    url: "https://fortune.com/2025/09/27/mouth-tape-sleep-hack-snoring-apnea-suffocation-risk/",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&cb=488698",
    content: "Having your mouth taped shut is the stuff of nightmares — but some people are doing just that to themselves. And in an attempt to sleep better, no less. Doctors say don't do it. Some on social media say it's a hack for getting more and better sleep and to reduce snoring. The claims — which are not backed by science — are taking off on places like TikTok, sometimes pushed by people working for companies selling related products.",
    created_at: "2025-09-27T10:30:00Z",
    publishedAt: new Date("2025-09-27T10:30:00Z"),
    author: "Kenya Hunter",
    category: "Health",
    readTime: 5,
    summary: "Doctors warn against the dangerous mouth-taping sleep trend promoted on social media, citing potential suffocation risks and lack of scientific backing."
  },
  {
    id: "2",
    title: "NFL office shooter had low-level CTE, NYC medical examiner finds",
    url: "https://fortune.com/2025/09/26/shane-tamura-cte-concussion-nfl-office-shooter-blackstone/",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&cb=488698",
    content: "Shane Tamura, who carried out a fatal shooting attack at a Manhattan office tower housing the National Football League, showed evidence of early-stage degenerative brain disease tied to repeated blows to the head, according to New York City's chief medical examiner. The shooter had left a note at the crime scene accusing the NFL of abandoning players with head injuries and asked that his brain be examined for chronic traumatic encephalopathy.",
    created_at: "2025-09-26T14:15:00Z",
    publishedAt: new Date("2025-09-26T14:15:00Z"),
    author: "Myles Miller",
    category: "Health",
    readTime: 7,
    summary: "Medical examiner confirms CTE in NFL office shooter, highlighting ongoing concerns about football-related brain injuries and their long-term effects."
  },
  {
    id: "3", 
    title: "The 5 Best Testosterone Boosters of 2025: Tested and Reviewed",
    url: "https://fortune.com/article/best-testosterone-boosters/",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&cb=488698",
    content: "TestoPrime emerges as our top choice for testosterone booster supplements in 2025, offering a comprehensive blend of natural ingredients backed by scientific research. After thorough testing and evaluation of dozens of products, our experts have identified the most effective testosterone boosters available today.",
    created_at: "2025-09-26T12:00:00Z",
    publishedAt: new Date("2025-09-26T12:00:00Z"),
    author: "Fortune Health Team",
    category: "Health",
    readTime: 8,
    summary: "Expert review of the top 5 testosterone boosters for 2025, featuring TestoPrime as the leading choice based on ingredient quality and scientific backing."
  },
  {
    id: "4",
    title: "The Best Probiotic Supplements for Women (2025): Expert Approved",
    url: "https://fortune.com/article/best-probiotics-for-women/",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&cb=488698",
    content: "Women have unique digestive and reproductive health needs that require specific probiotic strains. Our experts have evaluated the best probiotic supplements specifically formulated for women's health, considering factors like strain diversity, CFU count, and clinical research support.",
    created_at: "2025-09-26T09:45:00Z",
    publishedAt: new Date("2025-09-26T09:45:00Z"),
    author: "Fortune Health Team", 
    category: "Health",
    readTime: 6,
    summary: "Comprehensive guide to the best probiotic supplements for women, featuring expert-approved options for digestive and reproductive health support."
  },
  {
    id: "5",
    title: "International expats in the United States are running away to Panama in retirement, enjoying the same quality of life for 40% less than back home",
    url: "https://fortune.com/2025/09/26/international-expats-united-states-and-in-retirement-are-running-away-to-panama-enjoying-the-same-quality-of-life-affordable-living-for-40-less-than-back-home-in-the-west-savings-investment-inflation/",
    image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&cb=488698",
    content: "American retirees are increasingly looking to Panama as an affordable retirement destination, with many finding they can maintain the same quality of life for up to 40% less than what they'd spend in the United States. The country offers attractive retiree benefits and a lower cost of living.",
    created_at: "2025-09-26T08:30:00Z",
    publishedAt: new Date("2025-09-26T08:30:00Z"),
    author: "Fortune Staff",
    category: "Lifestyle",
    readTime: 5,
    summary: "U.S. expats are choosing Panama for retirement, finding significant cost savings while maintaining their quality of life in a welcoming environment."
  },
  {
    id: "6",
    title: "Meta's new AI dating bot is designed to combat burnout and swipe fatigue on dating apps",
    url: "https://fortune.com/2025/09/26/meta-facebook-ai-dating-bot-burnout-swipe-fatigue/",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80&cb=488698",
    content: "Meta is developing an AI-powered dating assistant designed to help users overcome the exhaustion and burnout associated with modern dating apps. The technology aims to streamline the dating process and reduce the mental fatigue that comes from endless swiping and superficial interactions.",
    created_at: "2025-09-26T16:45:00Z",
    publishedAt: new Date("2025-09-26T16:45:00Z"),
    author: "Fortune Tech Team",
    category: "Technology",
    readTime: 4,
    summary: "Meta's new AI dating assistant aims to reduce swipe fatigue and burnout by providing more meaningful connections for online dating users."
  },
  {
    id: "7",
    title: "Telehealth for Medicare patients is on the chopping block as Congress narrows in on an extension deadline. 'The uncertainty creates a lack of trust,' healthcare CEO says",
    url: "https://fortune.com/2025/09/25/telehealth-medicare-patients-congress-extension-deadline-distrust/",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80&cb=488698",
    content: "Congress is once again closing in on a deadline to extend Medicare coverage of home telehealth services. And, again, the decision has been left until the last minute. Telehealth has had new flexibilities since the Covid-19 public health emergency began, including expanded Medicare reimbursement. If nothing is passed, on Oct. 1, many Medicare members won't be able to access telemedicine from their homes anymore. Even if an extension is passed, this uncertainty still impacts providers' businesses, leaving them struggling to plan for a potential future where they might lose a chunk of their patients.",
    created_at: "2025-09-25T11:00:00Z",
    publishedAt: new Date("2025-09-25T11:00:00Z"),
    author: "Caroline Catherman",
    category: "Health",
    readTime: 6,
    summary: "Congress faces a critical deadline to extend Medicare telehealth coverage, with uncertainty creating operational challenges for healthcare providers and potential access disruption for patients."
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
