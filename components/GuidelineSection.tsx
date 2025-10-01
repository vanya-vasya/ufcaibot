import Image from "next/image";
import { cn } from "@/lib/utils";

interface GuidelineStep {
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
}

interface GuidelineSectionProps {
  gradient?: string;
  className?: string;
  toolId?: string;
}

const chefGuidelineSteps: GuidelineStep[] = [
  {
    title: "1. Gather Your Ingredients",
    description: "Take a look at what you already have in your kitchen. No need to overthink—just grab a few pantry staples, vegetables, or any fresh items you'd like to cook with.",
    imagePath: "/images/guidelines/step-1-gather-ingredients.png",
    imageAlt: "Colorful fresh ingredients including vegetables and pantry staples arranged on a kitchen counter"
  },
  {
    title: "2. Snap a Quick Photo",
    description: "Open your camera and take a clear photo of your ingredients. Don't worry if it isn't perfect—just make sure everything you want to cook with is visible.",
    imagePath: "/images/guidelines/step-2-snap-photo.png",
    imageAlt: "Smartphone camera taking a photo of fresh ingredients with focus grid visible"
  },
  {
    title: "3. Upload to Our Service",
    description: "Share the photo with our service. With just one snap, you're giving our smart system the clues it needs to create something special for you.",
    imagePath: "/images/guidelines/step-3-upload-service.png",
    imageAlt: "Food photo being uploaded to cloud service with upload arrow and digital elements"
  },
  {
    title: "4. Discover Your Ready-to-Cook Recipe",
    description: "Almost instantly, you'll receive a tailored recipe suggestion based on your ingredients. The service picks the most optimal dish for what you already have at home—so nothing goes to waste.",
    imagePath: "/images/guidelines/step-4-discover-recipe.png",
    imageAlt: "Beautiful recipe card with finished dish, nutritional information, and cooking instructions"
  }
];

const nutritionistGuidelineSteps: GuidelineStep[] = [
  {
    title: "1. Share Your Goals",
    description: "Tell us a little about yourself—your health goals, lifestyle, and what you'd like to improve. This helps us understand what truly matters to you.",
    imagePath: "/images/guidelines/nutritionist-step-1-share-goals.png",
    imageAlt: "Person comfortably sharing health goals with wellness icons and supportive atmosphere"
  },
  {
    title: "2. Add Your Personal Details",
    description: "We'll gently ask about your age, activity level, and any allergies or food preferences. This ensures your plan is safe, relevant, and tailored just for you.",
    imagePath: "/images/guidelines/nutritionist-step-2-personal-details.png",
    imageAlt: "Friendly form interface showing personal details input with activity and dietary preference icons"
  },
  {
    title: "3. Receive Your Personalized Plan",
    description: "Based on what you share, we'll create clear, step-by-step guidance that feels easy to follow. Think of it as having your own supportive nutrition coach right in your pocket.",
    imagePath: "/images/guidelines/nutritionist-step-3-personalized-plan.png",
    imageAlt: "Personalized nutrition plan displaying step-by-step guidance and meal recommendations"
  },
  {
    title: "4. Explore Daily Recommendations",
    description: "From meal ideas to smart tips, you'll see suggestions designed to fit smoothly into your everyday life—no stress, no confusion.",
    imagePath: "/images/guidelines/nutritionist-step-4-daily-recommendations.png",
    imageAlt: "Daily routine with healthy meal suggestions and wellness guidance integrated naturally"
  }
];

export const GuidelineSection = ({ gradient, className, toolId = 'master-chef' }: GuidelineSectionProps) => {
  // Select appropriate guideline steps based on tool type
  const guidelineSteps = toolId === 'master-nutritionist' 
    ? nutritionistGuidelineSteps 
    : chefGuidelineSteps;
  
  // Get appropriate header text based on tool type
  const headerTitle = "How It Works";
  const headerDescription = toolId === 'master-nutritionist'
    ? "Your personalized nutrition journey in four simple steps"
    : "Transform your ingredients into delicious recipes in just four simple steps";

  return (
    <div className={cn("w-full max-w-6xl mx-auto py-8 px-4", className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold mb-4",
          gradient ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent` : "text-gray-900"
        )}>
          {headerTitle}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {headerDescription}
        </p>
      </div>

      {/* Steps Grid - 2x2 on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {guidelineSteps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "group relative",
              "bg-white rounded-2xl overflow-hidden",
              "shadow-md hover:shadow-xl transition-all duration-300",
              "border border-gray-200 hover:border-gray-300",
              "transform hover:-translate-y-1"
            )}
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
              <Image
                src={step.imagePath}
                alt={step.imageAlt}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient Overlay */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                gradient ? `bg-gradient-to-br ${gradient}` : "bg-gradient-to-br from-gray-900 to-gray-600"
              )} />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className={cn(
                "text-xl md:text-2xl font-bold mb-3",
                gradient ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent` : "text-gray-900"
              )}>
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Step Number Badge */}
            <div className={cn(
              "absolute top-4 right-4",
              "w-12 h-12 rounded-full",
              "flex items-center justify-center",
              "text-white font-bold text-lg",
              "shadow-lg",
              gradient ? `bg-gradient-to-br ${gradient}` : "bg-gradient-to-br from-gray-800 to-gray-600"
            )}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm md:text-base">
          {toolId === 'master-nutritionist' 
            ? "Ready to get started? Share your health goals above!" 
            : "Ready to get started? Upload your first image above!"}
        </p>
      </div>
    </div>
  );
};

