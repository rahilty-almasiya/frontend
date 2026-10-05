import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Testimonial } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import Skeleton from "./Skeleton";
import ScrollReveal from "./ScrollReveal";

const Testimonials: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.getTestimonials();
        setTestimonials(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mx-auto mb-16" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("testimonials_title")}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </ScrollReveal>

        <ScrollReveal
          animation="zoom-in"
          delay="200ms"
          className="relative max-w-4xl mx-auto"
        >
          <button
            onClick={prevSlide}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden md:flex w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all text-slate-500 dark:text-slate-400 z-10 hover:scale-110 active:scale-95 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden md:flex w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all text-slate-500 dark:text-slate-400 z-10 hover:scale-110 active:scale-95 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  dir === "rtl"
                    ? `translateX(${activeIndex * 100}%)`
                    : `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-center relative group hover:-translate-y-1 transition-transform duration-500">
                    <Quote className="w-12 h-12 text-gold-200 dark:text-gold-900/30 absolute top-8 left-8" />

                    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gold-400/20 dark:border-gold-500/20 shadow-xl relative group">
                      {testimonial.image && !testimonial.image.includes('unsplash') ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gold-500/5 backdrop-blur-[2px]"></div>
                          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-inner flex items-center justify-center relative z-10 border border-white/50 dark:border-slate-600">
                             <User className="w-7 h-7 text-gold-600 dark:text-gold-500" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mb-6 space-x-1 rtl:space-x-reverse">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < (testimonial.rating || 5) ? 'text-gold-500 fill-current' : 'text-slate-300 dark:text-slate-700'} animate-pulse-slow`}
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 font-light leading-relaxed">
                      "{testimonial.comment ? testimonial.comment[language] : t(testimonial.commentKey)}"
                    </p>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gold-500 text-sm font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeIndex
                  ? "bg-gold-500 w-8"
                  : "bg-slate-300 dark:bg-slate-700 hover:bg-gold-300"
                  }`}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
