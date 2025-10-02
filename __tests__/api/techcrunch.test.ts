import { NextRequest } from 'next/server';
import { GET } from '@/app/api/techcrunch/route';

// Mock global fetch for N8N endpoint testing
global.fetch = jest.fn();

// Mock environment variables
const originalEnv = process.env;

describe('/api/techcrunch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns mock data when N8N endpoint is not configured', async () => {
    delete process.env.N8N_TECHCRUNCH_ENDPOINT;
    
    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.articles).toBeDefined();
    expect(data.articles.length).toBeGreaterThan(0);
    expect(data.total).toBeDefined();
    expect(data.page).toBe(1);
    expect(data.limit).toBe(20);
    expect(data.hasMore).toBeDefined();
  });

  it('handles pagination parameters correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/techcrunch?page=2&limit=10');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(2);
    expect(data.limit).toBe(10);
  });

  it('limits maximum articles per request', async () => {
    const request = new NextRequest('http://localhost:3000/api/techcrunch?limit=100');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.limit).toBeLessThanOrEqual(50); // Max limit should be enforced
  });

  it('fetches from N8N endpoint when configured', async () => {
    process.env.N8N_TECHCRUNCH_ENDPOINT = 'https://mock-n8n.com/webhook/techcrunch';
    
      const mockN8NResponse = [
      {
        title: 'N8N Test Article',
        url: 'https://fortune.com/section/health/',
        image: 'https://example.com/image.jpg',
        content: 'Test content from N8N',
        created_at: '2024-01-15T10:30:00Z',
        author: 'N8N Author',
        category: 'Health'
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockN8NResponse,
    });

    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      'https://mock-n8n.com/webhook/techcrunch',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'User-Agent': 'Yum-mi/1.0'
        })
      })
    );

    expect(response.status).toBe(200);
    expect(data.articles[0].title).toBe('N8N Test Article');
  });

  it('handles N8N endpoint errors gracefully', async () => {
    process.env.N8N_TECHCRUNCH_ENDPOINT = 'https://mock-n8n.com/webhook/techcrunch';
    
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    // Should fallback to mock data
    expect(response.status).toBe(200);
    expect(data.articles).toBeDefined();
    expect(data.articles.length).toBeGreaterThan(0);
  });

  it('handles N8N endpoint HTTP errors', async () => {
    process.env.N8N_TECHCRUNCH_ENDPOINT = 'https://mock-n8n.com/webhook/techcrunch';
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    // Should fallback to mock data
    expect(response.status).toBe(200);
    expect(data.articles).toBeDefined();
  });

  it('normalizes article data correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    
    // Check that each article has required normalized fields
    data.articles.forEach((article: TechCrunchArticle) => {
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('url');
      expect(article).toHaveProperty('publishedAt');
      expect(article).toHaveProperty('created_at');
      expect(typeof article.readTime).toBe('number');
    });
  });

  it('sets appropriate cache headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);

    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=300, stale-while-revalidate=600'
    );
  });

  it('filters out invalid articles', async () => {
    process.env.N8N_TECHCRUNCH_ENDPOINT = 'https://mock-n8n.com/webhook/techcrunch';
    
    const mockN8NResponse = [
      {
        title: 'Valid Article',
        url: 'https://fortune.com/section/health/',
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        // Invalid - no title
        url: 'https://fortune.com/section/health/',
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        title: 'Another Valid Article',
        // Invalid - no URL  
        created_at: '2024-01-15T10:30:00Z',
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockN8NResponse,
    });

    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Should only include valid articles
    expect(data.articles.length).toBe(1);
    expect(data.articles[0].title).toBe('Valid Article');
  });

  it('handles different N8N response formats', async () => {
    process.env.N8N_TECHCRUNCH_ENDPOINT = 'https://mock-n8n.com/webhook/techcrunch';
    
    // Test wrapped response format
    const mockWrappedResponse = {
      data: [
        {
          title: 'Wrapped Article',
          url: 'https://fortune.com/section/health/',
          created_at: '2024-01-15T10:30:00Z',
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWrappedResponse,
    });

    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.articles[0].title).toBe('Wrapped Article');
  });

  it('returns error response for invalid requests', async () => {
    // Simulate an internal error during processing
    const request = new NextRequest('http://localhost:3000/api/techcrunch');
    
    // Mock a scenario that would cause an error
    jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
      throw new Error('JSON stringify error');
    });

    const response = await GET(request);

    expect(response.status).toBe(500);
    
    // Clean up the mock
    jest.restoreAllMocks();
  });
});
