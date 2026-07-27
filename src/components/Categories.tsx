import React, { useState, useEffect } from 'react';
import { Code2, Database, Palette, Megaphone, DollarSign, Users, Brain, Shield, ArrowRight } from 'lucide-react';
import { categoryService } from '../services/supabaseApi';
import type { Category } from '../types/portal.types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Database,
  Palette,
  Megaphone,
  DollarSign,
  Users,
  Brain,
  Shield
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryService.getCategories().then((data) => {
      setCategories(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Explore Featured Categories
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Find the right track for your career path. Discover listings with high growth potential and verified employers.
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary-500/30 border-t-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = iconMap[category.iconName] || Code2;
              return (
                <div
                  key={category.id}
                  className="group relative bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Icon wrapper */}
                    <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Title & Count */}
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {category.count.toLocaleString()}+ Active Openings
                    </p>
                  </div>

                  {/* Hover arrow indicator */}
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <span>Explore jobs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
