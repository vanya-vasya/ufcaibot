import type { Meta, StoryObj } from '@storybook/react';
import ArticleCard from '@/components/insights/ArticleCard';

const meta: Meta<typeof ArticleCard> = {
  title: 'Components/Insights/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    index: {
      control: { type: 'number' },
      description: 'Card index for animation stagger',
    },
    priority: {
      control: { type: 'boolean' },
      description: 'Whether to load image with priority',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArticle: TechCrunchArticle = {
  id: 'story-1',
  title: 'AI-Powered Nutrition Apps Are Changing How We Eat',
  url: 'https://techcrunch.com/2024/ai-nutrition-apps-changing-eating',
  image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
  content: 'The rise of artificial intelligence in nutrition applications is revolutionizing personal health management. From personalized meal planning to real-time dietary tracking, these innovative platforms are making healthy eating more accessible and engaging than ever before.',
  created_at: '2024-01-15T10:30:00Z',
  publishedAt: new Date('2024-01-15T10:30:00Z'),
  author: 'Sarah Johnson',
  category: 'Health Tech',
  readTime: 5,
  summary: 'Exploring how AI-powered nutrition apps are transforming dietary habits and health outcomes through personalized recommendations and intelligent tracking.'
};

export const Default: Story = {
  args: {
    article: defaultArticle,
    index: 0,
    priority: false,
  },
};

export const WithPriority: Story = {
  args: {
    article: defaultArticle,
    index: 0,
    priority: true,
  },
};

export const LongTitle: Story = {
  args: {
    article: {
      ...defaultArticle,
      title: 'Revolutionary AI-Powered Nutrition and Wellness Applications Are Fundamentally Transforming How Modern Consumers Approach Healthy Eating and Lifestyle Management',
    },
    index: 0,
  },
};

export const NoImage: Story = {
  args: {
    article: {
      ...defaultArticle,
      image: undefined,
    },
    index: 0,
  },
};

export const MinimalData: Story = {
  args: {
    article: {
      id: 'minimal-1',
      title: 'Basic Article Title',
      url: 'https://techcrunch.com/basic-article',
      created_at: '2024-01-15T10:30:00Z',
      publishedAt: new Date('2024-01-15T10:30:00Z'),
    },
    index: 0,
  },
};

export const FoodTechArticle: Story = {
  args: {
    article: {
      id: 'food-tech-1',
      title: 'Food Tech Startups Raise $2.3B in Record Funding Round',
      url: 'https://techcrunch.com/2024/food-tech-funding-record',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      content: 'The food technology sector continues its explosive growth with unprecedented investment levels from venture capital firms worldwide.',
      created_at: '2024-01-14T14:15:00Z',
      publishedAt: new Date('2024-01-14T14:15:00Z'),
      author: 'Michael Chen',
      category: 'Funding',
      readTime: 7,
      summary: 'Record-breaking investment in food technology startups signals massive industry transformation and innovation acceleration.'
    },
    index: 1,
  },
};

export const SmartKitchenArticle: Story = {
  args: {
    article: {
      id: 'smart-kitchen-1',
      title: 'Smart Kitchen Devices: The Future of Home Cooking',
      url: 'https://techcrunch.com/2024/smart-kitchen-devices-future',
      image: 'https://images.unsplash.com/photo-1556909184-f23847fb0530?w=800&q=80',
      content: 'Connected kitchen appliances are making cooking more accessible and enjoyable for home chefs of all skill levels.',
      created_at: '2024-01-13T09:45:00Z',
      publishedAt: new Date('2024-01-13T09:45:00Z'),
      author: 'Lisa Park',
      category: 'Consumer Tech',
      readTime: 4,
      summary: 'How smart kitchen technology is revolutionizing home cooking experiences through automation and intelligence.'
    },
    index: 2,
  },
};

// Animation showcase
export const AnimationStagger: Story = {
  render: () => {
    const articles = [defaultArticle, {
      ...defaultArticle,
      id: 'story-2',
      title: 'Second Article for Animation',
    }, {
      ...defaultArticle,
      id: 'story-3',
      title: 'Third Article for Animation',
    }];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={index}
            priority={index === 0}
          />
        ))}
      </div>
    );
  },
};
