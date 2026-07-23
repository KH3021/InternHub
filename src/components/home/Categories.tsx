import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Database, Palette, Megaphone, DollarSign, Users, Brain, Shield, ArrowRight, Briefcase } from 'lucide-react';
import { categoryService } from '../../services/supabaseApi';
import type { Category } from '../../types/portal.types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Code: Code2,
  Database,
  Palette,
  Megaphone,
  TrendingUp: Megaphone,
  DollarSign,
  Users,
  Brain,
  BrainCircuit: Brain,
  Shield,
  Briefcase,
  Layers: Briefcase,
};

export default function Categories() {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getCategories().then((data) => {
      setCategoriesList(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 bg-slate-50/60 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Popular Categories
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Find roles suited for your specific domain expertise. Connected live to Supabase.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))
          ) : (
            categoriesList.map((category) => {
              const Icon = iconMap[category.iconName] || Briefcase;
              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
                  className="group relative bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:bg-gradient-to-tr group-hover:from-primary-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Title & Active Count */}
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {category.count.toLocaleString()}+ Active Openings
                    </p>
                  </div>

                  {/* Arrow CTA */}
                  <div className="mt-6 flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <span>Browse Category</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
