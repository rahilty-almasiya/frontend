import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  reviewableType: 'hotel' | 'tour_package';
  reviewableId: string;
  averageRating?: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviewableType, reviewableId, averageRating }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const fetchReviews = async (page = 1) => {
    try {
      const response = await api.getReviewsFor(reviewableType, reviewableId, page);
      if (Array.isArray(response)) {
        setReviews(response);
        setPagination({ current_page: 1, last_page: 1, total: response.length });
      } else {
        setReviews(response.data);
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewableType, reviewableId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const rating = userRating || parseInt((form.elements.namedItem('rating') as HTMLInputElement)?.value || '0');
    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;
    if (!rating) return;

    setSubmittingReview(true);
    try {
      await api.submitReview({ reviewable_type: reviewableType, reviewable_id: reviewableId, rating, comment });
      form.reset();
      setUserRating(0);
      fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'التقييمات' : 'Reviews'}
            </h2>
            <div className="flex items-center text-gold-500 font-bold bg-gold-500/5 px-4 py-2 rounded-xl border border-gold-500/10">
              <Star className="w-5 h-5 fill-current mr-2" />
              <span className="text-xl">{averageRating?.toFixed(1) || '5.0'}</span>
              <span className="text-slate-400 text-sm ml-2 font-normal">/ 5.0</span>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase">
                        {(review as any).user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {(review as any).user?.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date((review as any).created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gold-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Star className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500">{language === 'ar' ? 'لا توجد تقييمات حتى الآن' : 'No reviews yet'}</p>
              </div>
            )}

            {pagination.last_page > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchReviews(p)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${pagination.current_page === p
                      ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-gold-500/50'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">{language === 'ar' ? 'اكتب تقييمك' : 'Write a Review'}</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                {language === 'ar' ? 'شاركنا تجربتك لمساعدة العملاء الآخرين' : 'Share your experience to help other customers'}
              </p>

              {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest block mb-2 text-slate-400">
                      {language === 'ar' ? 'التقييم' : 'Rating'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <label
                          key={num}
                          className="cursor-pointer group"
                          onMouseEnter={() => setHoveredRating(num)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setUserRating(num)}
                        >
                          <input type="radio" name="rating" value={num} className="sr-only" required />
                          <Star
                            className={`w-6 h-6 transition-all duration-200 ${(hoveredRating || userRating) >= num
                              ? 'fill-gold-500 text-gold-500 scale-110'
                              : 'text-slate-600 group-hover:text-gold-400'
                              }`}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest block mb-2 text-slate-400">
                      {language === 'ar' ? 'تعليقك' : 'Comment'}
                    </label>
                    <textarea
                      name="comment"
                      className="w-full bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 min-h-[100px]"
                      placeholder={language === 'ar' ? 'شاركنا رأيك...' : 'Share your thoughts...'}
                    ></textarea>
                  </div>
                  <button
                    disabled={submittingReview}
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
                  >
                    {submittingReview ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال التقييم' : 'Submit Review')}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-sm text-slate-300 mb-4">
                    {language === 'ar' ? 'يجب تسجيل الدخول لإضافة تقييم' : 'You must log in to leave a review'}
                  </p>
                  <Link to="/login" className="px-6 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-gold-500 hover:text-white transition-colors">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
