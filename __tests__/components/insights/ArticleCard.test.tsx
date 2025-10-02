import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import ArticleCard from '@/components/insights/ArticleCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

const mockArticle: TechCrunchArticle = {
  id: 'test-1',
  title: 'Test Article Title',
  url: 'https://fortune.com/section/health/',
  image: 'https://example.com/image.jpg',
  content: 'This is test article content that should be displayed in the card.',
  created_at: '2024-01-15T10:30:00Z',
  publishedAt: new Date('2024-01-15T10:30:00Z'),
  author: 'Test Author',
  category: 'Technology',
  readTime: 5,
  summary: 'This is a test article summary that provides a brief overview of the content.'
};

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test article summary that provides a brief overview of the content.')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('displays formatted publish date', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const expectedDate = format(new Date(mockArticle.publishedAt), "MMM d, yyyy");
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('renders article image with correct alt text', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const image = screen.getByAltText('Test Article Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('creates proper external links to Fortune', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href', 'https://fortune.com/section/health/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('handles missing optional fields gracefully', () => {
    const minimalArticle: TechCrunchArticle = {
      id: 'test-2',
      title: 'Minimal Article',
      url: 'https://fortune.com/section/health/',
      created_at: '2024-01-15T10:30:00Z',
      publishedAt: new Date('2024-01-15T10:30:00Z'),
    };

    render(<ArticleCard article={minimalArticle} />);
    
    expect(screen.getByText('Minimal Article')).toBeInTheDocument();
    // Should not show category, author, or read time when not provided
    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
    expect(screen.queryByText('min read')).not.toBeInTheDocument();
  });

  it('displays fallback content when image is not provided', () => {
    const articleWithoutImage: TechCrunchArticle = {
      ...mockArticle,
      image: undefined,
    };

    render(<ArticleCard article={articleWithoutImage} />);
    
    // Should still render the card without errors
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    // Should not render img element when no image
    expect(screen.queryByAltText('Test Article Title')).not.toBeInTheDocument();
  });

  it('includes structured data for SEO', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    expect(structuredData).toBeInTheDocument();
    
    if (structuredData) {
      const jsonLD = JSON.parse(structuredData.textContent || '{}');
      expect(jsonLD['@type']).toBe('Article');
      expect(jsonLD.headline).toBe('Test Article Title');
      expect(jsonLD.url).toBe('https://fortune.com/section/health/');
      expect(jsonLD.author.name).toBe('Test Author');
    }
  });

  it('applies priority loading for prioritized cards', () => {
    render(<ArticleCard article={mockArticle} priority={true} />);
    
    // This would typically check for priority prop on Image component
    // Implementation depends on your specific Image component setup
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });
});
