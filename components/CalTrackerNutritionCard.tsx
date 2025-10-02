import React from "react";
import { cn } from "@/lib/utils";
import { ChefHat, Activity } from "lucide-react";

interface NutritionData {
  dish: string;
  kcal: number;
  prot: number;
  fat: number;
  carb: number;
}

interface CalTrackerNutritionCardProps {
  data: NutritionData;
  gradient?: string;
  className?: string;
}

export function CalTrackerNutritionCard({ 
  data, 
  gradient = "from-amber-400 via-orange-500 to-red-600",
  className 
}: CalTrackerNutritionCardProps) {
  return (
    <div className={cn(
      "mx-auto max-w-4xl rounded-2xl shadow-xl border-0 overflow-hidden",
      "transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]",
      className
    )}>
      {/* Header with gradient background */}
      <div className={cn(
        "relative overflow-hidden p-8",
        `bg-gradient-to-r ${gradient}`
      )}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-8xl">
            👨‍🍳
          </div>
          <div className="absolute bottom-4 left-8 h-12 w-12 rounded-full bg-white opacity-20"></div>
          <div className="absolute top-8 left-20 h-6 w-6 rounded-full bg-white opacity-20"></div>
          <div className="absolute top-16 right-20 h-8 w-8 rounded-full bg-white opacity-15"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                {data.dish}
              </h2>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Activity className="h-4 w-4 text-white" />
                <span className="text-white font-medium text-sm">
                  Your Own Chef Recipe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition badges section */}
      <div className="p-8 bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <span className="text-red-600 font-medium text-sm">kcal</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{data.kcal}</div>
          </div>

          {/* Protein */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">💪</span>
              <span className="text-blue-600 font-medium text-sm">Protein</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{data.prot}g</div>
          </div>

          {/* Fat */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🥑</span>
              <span className="text-green-600 font-medium text-sm">Fat</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{data.fat}g</div>
          </div>

          {/* Carbs */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🌾</span>
              <span className="text-purple-600 font-medium text-sm">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{data.carb}g</div>
          </div>
        </div>

        {/* Additional info section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">✨</span>
            <p className="text-gray-700 font-medium text-center">
              Nutritional analysis complete! Track your intake and maintain a balanced diet for optimal health.
            </p>
            <span className="text-2xl">🎯</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6 bg-white">
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            <span>Generated by Your Own Tracker AI</span>
          </div>
          <div className="text-xs">
            Precise nutritional tracking
          </div>
        </div>
      </div>
    </div>
  );
}
