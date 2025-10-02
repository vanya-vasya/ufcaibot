# Fortune Health Latest Insights Integration

## Overview
The Latest Insights section fetches and displays Fortune health articles in a McKinsey Insights-style layout on the blog page. The integration supports real-time data fetching via N8N workflows, client-side pagination, and comprehensive error handling.

## Features
- **McKinsey-style UI**: Professional card layout with proper typography, spacing, and hover effects
- **Real-time Data**: Fetches latest articles via N8N webhook parser
- **Performance Optimized**: Image lazy loading, skeleton loaders, and caching
- **Responsive Design**: Mobile-first approach with adaptive grid layouts  
- **Accessibility**: Semantic markup, ARIA labels, and keyboard navigation
- **SEO Optimized**: Structured data markup and meta information
- **Analytics Ready**: Event tracking for article impressions and clicks

## Configuration

### Environment Variables
Add these variables to your `.env.local` file:

```env
# N8N Fortune Health Parser Endpoint
N8N_TECHCRUNCH_ENDPOINT=https://your-n8n-instance.com/webhook/fortune-health-parser

# Optional: Configure cache settings (defaults shown)
TECHCRUNCH_CACHE_TTL=300  # 5 minutes
TECHCRUNCH_MAX_ARTICLES=50
```

### N8N Workflow Setup
The N8N workflow should return data in this format:

```json
[
  {
    "title": "Article Title",
    "url": "https://fortune.com/section/health/",
    "image": "https://image-url.jpg",
    "content": "Full article content...",
    "created_at": "2024-01-15T10:30:00Z",
    "author": "Author Name",
    "category": "Technology"
  }
]
```

### API Contract
The `/api/techcrunch` endpoint accepts:
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Articles per page (max: 50, default: 20)

Response format:
```json
{
  "articles": [...],
  "total": 45,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

## Components

### ArticleCard
Main article display component with:
- Responsive image with lazy loading
- Category tags and metadata display
- SEO structured data markup
- External link indicators
- Hover animations and states

### ArticleCardSkeleton
Loading state component with:
- Animated skeleton placeholders
- Staggered loading animations
- Grid layout support

### InsightsSection
Main container component featuring:
- Data fetching and state management
- Error handling and retry logic
- Pagination and infinite scroll
- Analytics event tracking

## Local Development

1. **Install dependencies**:
   ```bash
   npm install date-fns
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Test with mock data**:
   - Without N8N endpoint configured, the API uses mock Fortune health articles
   - Mock data includes realistic content for testing UI components

4. **Configure N8N (Optional)**:
   - Set `N8N_TECHCRUNCH_ENDPOINT` in `.env.local`
   - Test endpoint returns valid article data

## Testing

### Unit Tests
```bash
npm run test -- --testPathPattern=insights
```

### Visual Regression Tests
```bash
npm run test:visual -- --testNamePattern="ArticleCard|InsightsSection"
```

### API Testing
```bash
curl http://localhost:3000/api/techcrunch?page=1&limit=5
```

## Performance Optimization

- **Image Loading**: First 3 articles use `priority` loading, others are lazy-loaded
- **Caching**: API responses cached for 5 minutes with stale-while-revalidate
- **Bundle Size**: Components use tree-shaking friendly imports
- **Core Web Vitals**: Optimized for LCP and CLS metrics

## Analytics Events

The integration tracks these events:
- `insights_loaded`: When articles are successfully fetched
- `article_click`: When users click on article links

## Troubleshooting

### Common Issues

**Mock data displayed instead of real articles**:
- Check `N8N_TECHCRUNCH_ENDPOINT` is correctly set
- Verify N8N workflow is accessible and returning data

**Loading states persist**:
- Check browser console for API errors
- Verify API endpoint is responding with expected format

**Images not loading**:
- Check image URLs are accessible
- Verify Next.js image domains are configured if needed

**Styling issues**:
- Ensure Tailwind CSS classes are available
- Check for CSS conflicts with existing styles

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages in API responses.

## Browser Support
- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- Mobile responsive (iOS 14+, Android 10+)
- Progressive enhancement for older browsers
