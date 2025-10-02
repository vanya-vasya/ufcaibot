import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import InsightsSection from '@/components/insights/InsightsSection';

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

jest.mock('react-hot-toast');
jest.mock('@/components/insights/ArticleCard', () => {
  return function MockArticleCard({ article }: { article: TechCrunchArticle }) {
    return <div data-testid={`article-${article.id}`}>{article.title}</div>;
  };
});

jest.mock('@/components/insights/ArticleCardSkeleton', () => ({
  ArticleGridSkeleton: ({ count }: { count: number }) => (
    <div data-testid="skeleton-grid">Loading {count} articles...</div>
  ),
}));

// Mock global fetch
global.fetch = jest.fn();

const mockArticles: TechCrunchArticle[] = [
  {
    id: '1',
    title: 'Article 1',
    url: 'https://fortune.com/section/health/',
    created_at: '2024-01-15T10:30:00Z',
    publishedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    title: 'Article 2',
    url: 'https://fortune.com/section/health/',
    created_at: '2024-01-14T14:15:00Z',
    publishedAt: new Date('2024-01-14T14:15:00Z'),
  },
];

const mockApiResponse: TechCrunchApiResponse = {
  articles: mockArticles,
  total: 20,
  page: 1,
  limit: 20,
  hasMore: true,
};

describe('InsightsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders section header correctly', () => {
    render(<InsightsSection initialArticles={mockArticles} />);
    
    expect(screen.getByText('Latest Insights')).toBeInTheDocument();
    expect(screen.getByText(/Stay up-to-date with the latest trends/)).toBeInTheDocument();
  });

  it('displays initial articles when provided', () => {
    render(<InsightsSection initialArticles={mockArticles} />);
    
    expect(screen.getByTestId('article-1')).toBeInTheDocument();
    expect(screen.getByTestId('article-2')).toBeInTheDocument();
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  it('shows loading skeleton when no initial articles', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    render(<InsightsSection initialArticles={[]} />);
    
    // Should show loading state initially
    expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton-grid')).not.toBeInTheDocument();
    });
  });

  it('fetches articles on mount when no initial articles provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    render(<InsightsSection initialArticles={[]} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/techcrunch?page=1&limit=20', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('handles API errors gracefully', async () => {
    const mockToastError = jest.mocked(toast.error);
    
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<InsightsSection initialArticles={[]} />);
    
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to load articles. Please try again.');
    });

    expect(screen.getByText('Unable to Load Articles')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('displays article count when articles are loaded', () => {
    render(<InsightsSection initialArticles={mockArticles} />);
    
    // Mock the state to show total
    expect(screen.getByText(/Showing \d+ of \d+ articles/)).toBeInTheDocument();
  });

  it('handles load more functionality', async () => {
    const moreArticles = [
      {
        id: '3',
        title: 'Article 3',
        url: 'https://fortune.com/section/health/',
        created_at: '2024-01-13T09:45:00Z',
        publishedAt: new Date('2024-01-13T09:45:00Z'),
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockApiResponse,
        page: 2,
        articles: moreArticles,
        hasMore: false,
      }),
    });

    // Start with articles that indicate more are available
    render(<InsightsSection initialArticles={mockArticles} />);
    
    const loadMoreButton = screen.getByText('Load More Articles');
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/techcrunch?page=2&limit=20', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('shows empty state when no articles available', () => {
    render(<InsightsSection initialArticles={[]} />);
    
    // Mock no loading and no error state
    expect(screen.getByText('No Articles Available')).toBeInTheDocument();
    expect(screen.getByText(/We're working on bringing you the latest insights/)).toBeInTheDocument();
  });

  it('handles retry functionality', async () => {
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Initial error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

    render(<InsightsSection initialArticles={[]} />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('disables load more button when loading', async () => {
    render(<InsightsSection initialArticles={mockArticles} />);
    
    // Mock a slow response to test loading state
    (fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const loadMoreButton = screen.getByText('Load More Articles');
    fireEvent.click(loadMoreButton);

    // Should show loading state
    expect(screen.getByText('Loading More...')).toBeInTheDocument();
  });

  it('applies custom className prop', () => {
    const { container } = render(
      <InsightsSection initialArticles={[]} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
