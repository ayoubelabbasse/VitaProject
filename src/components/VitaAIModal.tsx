'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';
import { productCatalog } from '@/data/products';
import type { Product } from '@/types';

interface VitaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type QuizGoal = 'energy' | 'sleep' | 'heart' | 'immune' | 'performance';
type QuizActivity = 'low' | 'moderate' | 'high';
type QuizDiet = 'none' | 'vegan' | 'vegetarian' | 'pescatarian';
type QuizForm = 'none' | 'capsules' | 'softgels' | 'gummies' | 'tablets';
type QuizBudget = 'any' | 'under-100' | '100-150' | '150-plus';
type QuizAvoid = 'none' | 'fish' | 'gelatin';

type QuizAnswers = {
  goal?: QuizGoal;
  activity?: QuizActivity;
  diet?: QuizDiet;
  form?: QuizForm;
  budget?: QuizBudget;
  avoid?: QuizAvoid;
};

const QUESTIONS: Array<{
  id: keyof QuizAnswers;
  title: string;
  options: Array<{ label: string; value: NonNullable<QuizAnswers[keyof QuizAnswers]> }>;
}> = [
  {
    id: 'goal',
    title: 'Your goal?',
    options: [
      { label: 'Energy', value: 'energy' },
      { label: 'Sleep', value: 'sleep' },
      { label: 'Heart', value: 'heart' },
      { label: 'Immunity', value: 'immune' },
      { label: 'Performance', value: 'performance' },
    ],
  },
  {
    id: 'activity',
    title: 'Activity level?',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    id: 'diet',
    title: 'Diet preference?',
    options: [
      { label: 'No preference', value: 'none' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Pescatarian', value: 'pescatarian' },
    ],
  },
  {
    id: 'form',
    title: 'Preferred form?',
    options: [
      { label: 'No preference', value: 'none' },
      { label: 'Capsules', value: 'capsules' },
      { label: 'Softgels', value: 'softgels' },
      { label: 'Gummies', value: 'gummies' },
      { label: 'Tablets', value: 'tablets' },
    ],
  },
  {
    id: 'budget',
    title: 'Budget (MAD)?',
    options: [
      { label: 'Any', value: 'any' },
      { label: '< 100', value: 'under-100' },
      { label: '100–150', value: '100-150' },
      { label: '150+', value: '150-plus' },
    ],
  },
  {
    id: 'avoid',
    title: 'Avoid?',
    options: [
      { label: 'Nothing', value: 'none' },
      { label: 'Fish', value: 'fish' },
      { label: 'Gelatin', value: 'gelatin' },
    ],
  },
];

const GOAL_CATEGORIES: Record<QuizGoal, string[]> = {
  energy: ['Performance', 'Minerals', 'Wellness', 'Immune Support', 'Stress Support'],
  sleep: ['Relaxation & Sleep', 'Stress Support', 'Minerals'],
  heart: ['Heart Health', 'Immune Support', 'Minerals'],
  immune: ['Immune Support', 'Minerals', 'Wellness'],
  performance: ['Performance', 'Minerals', 'Wellness'],
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchesForm(product: Product, form: QuizForm): boolean {
  if (form === 'none') return true;
  const haystack = normalizeText(
    `${product.packageQuantity ?? ''} ${product.variants?.map((v) => v.label).join(' ') ?? ''}`
  );
  if (form === 'softgels') return haystack.includes('softgel');
  if (form === 'gummies') return haystack.includes('gumm');
  if (form === 'capsules') return haystack.includes('capsule');
  if (form === 'tablets') return haystack.includes('tablet');
  return true;
}

function withinBudget(price: number, budget: QuizBudget): boolean {
  if (budget === 'any') return true;
  if (budget === 'under-100') return price < 100;
  if (budget === '100-150') return price >= 100 && price <= 150;
  if (budget === '150-plus') return price > 150;
  return true;
}

function applyAvoidFilters(product: Product, avoid: QuizAvoid): boolean {
  if (avoid === 'none') return true;
  const ingredients = normalizeText(product.ingredients?.join(' ') ?? '');
  if (avoid === 'fish') {
    return !ingredients.includes('fish') && !normalizeText(product.category).includes('omega');
  }
  if (avoid === 'gelatin') {
    return !ingredients.includes('gelatin');
  }
  return true;
}

function pickTop3Products(answers: QuizAnswers): Product[] {
  const goal = answers.goal ?? 'immune';
  const activity = answers.activity ?? 'moderate';
  const diet = answers.diet ?? 'none';
  const form = answers.form ?? 'none';
  const budget = answers.budget ?? 'any';
  const avoid = answers.avoid ?? 'none';

  const basePreferred = GOAL_CATEGORIES[goal] ?? [];
  const preferredCategories =
    activity === 'high'
      ? ['Performance', ...basePreferred]
      : activity === 'low'
        ? ['Stress Support', 'Relaxation & Sleep', ...basePreferred]
        : basePreferred;

  let candidates = productCatalog.filter((p) => p.inStock);

  // Prefer matching categories first, but keep fallback if too few
  const categoryMatches = candidates.filter((p) => preferredCategories.includes(p.category));
  if (categoryMatches.length >= 3) {
    candidates = categoryMatches;
  }

  if (diet !== 'none') {
    candidates = candidates.filter((p) => (p.diets ?? []).some((d) => normalizeText(d) === diet));
  }

  candidates = candidates.filter((p) => matchesForm(p, form));
  candidates = candidates.filter((p) => withinBudget(p.price, budget));
  candidates = candidates.filter((p) => applyAvoidFilters(p, avoid));

  if (candidates.length < 3) {
    candidates = productCatalog.filter((p) => p.inStock);
    const catFallback = candidates.filter((p) => preferredCategories.includes(p.category));
    candidates = catFallback.length >= 3 ? catFallback : candidates;
  }

  return [...candidates]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviews ?? 0) - (a.reviews ?? 0))
    .slice(0, 3);
}

const VitaAIModal: React.FC<VitaAIModalProps> = ({ isOpen, onClose }) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnswers({});
      setShowResults(false);
    } else {
      setAnswers({});
      setShowResults(false);
    }
  }, [isOpen]);

  const isComplete = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const top3 = useMemo(() => {
    if (!showResults) return [];
    return pickTop3Products(answers);
  }, [answers, showResults]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[650px] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">TAQA AI</h2>
                  <p className="text-sm text-white/80">6 quick questions → top 3 picks</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-bg">
            {!showResults ? (
              <div className="space-y-4">
                <p className="text-xs text-muted">
                  Quick + simple. Answer 6 questions and TAQA AI will suggest 3 products.
                </p>

                <div className="space-y-3">
                  {QUESTIONS.map((q) => (
                    <div key={q.id} className="rounded-xl border border-border bg-white p-4">
                      <p className="text-xs font-semibold text-text mb-3">{q.title}</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {q.options.map((opt) => {
                          const selected = answers[q.id] === opt.value;
                          return (
                            <button
                              key={String(opt.value)}
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                              className={`text-xs px-3 py-2 rounded-lg border transition-colors text-left ${
                                selected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-primary/5 text-text'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="text-xs font-semibold text-primary">TAQA AI</p>
                  </div>
                  <p className="text-sm font-semibold text-text">Top 3 picks for you:</p>
                  <p className="text-xs text-muted mt-1">Based on your answers.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {top3.map((product) => (
                    <div key={product.id} className="rounded-xl border border-border bg-white p-4">
                      <p className="text-xs font-semibold text-text leading-snug">{product.name}</p>
                      <p className="text-[11px] text-muted mt-1">{product.brand}</p>
                      <p className="text-sm font-semibold text-text mt-3">{product.price.toFixed(2)} MAD</p>
                      <Link
                        href={`/product/${product.id}`}
                        onClick={onClose}
                        className="mt-3 inline-flex text-xs font-semibold text-primary hover:text-primary/80"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-bg flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setShowResults(false);
              }}
              className="text-xs font-semibold text-muted hover:text-text transition-colors"
            >
              Reset
            </button>

            {!showResults ? (
              <button
                type="button"
                disabled={!isComplete}
                onClick={() => setShowResults(true)}
                className="btn-primary py-2 px-4 rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Show my top 3
              </button>
            ) : (
              <button type="button" onClick={onClose} className="btn-primary py-2 px-4 rounded-xl text-xs">
                Done
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VitaAIModal;

