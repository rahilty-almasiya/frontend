"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { api, transformImage } from "../services/api";
import { CompanyStat } from "../types";
import { Shield, Target, Eye, Star, Lock, Clock, CheckCircle2, ArrowDown, Users, Calendar, Briefcase } from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import { COMPANY_STATS } from "../constants";
import SEO from "../components/SEO";
import Breadcrumbs from "../components/Breadcrumbs";



/* ---------------------------
   CountUp Component
   --------------------------- */
type CountUpProps = {
  end: number;         // الرقم النهائي (مثلاً 50 أو 1000)
  raw?: string;        // النص الأصلي (مثلاً "50+" أو "1K+")
  duration?: number;   // مدة الأنيميشن بالثواني
  className?: string;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const CountUp: React.FC<CountUpProps> = ({ end, raw, duration = 1.6, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number | null>(null);

  // ابدأ العد عند دخول العنصر للـ viewport
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [started]);

  // animation loop
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const durMs = duration * 1000;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durMs);
      const eased = easeOutCubic(t);
      const current = Math.round(eased * end);
      setValue(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // تأكد من إظهار القيمة النهائية
        setValue(end);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, end, duration]);

  const finished = value === end;
  const during = new Intl.NumberFormat().format(value);
  const finalDisplay = raw ?? new Intl.NumberFormat().format(end);
  const display = finished ? finalDisplay : during;

  return (
    <div ref={ref} className={className}>
      {display}
    </div>
  );
};

/* ---------------------------
   Helper to parse raw value -> numeric end
   Supports: "50+", "1K+", "1.2K+", numbers, etc.
   --------------------------- */
const parseRawToNumber = (raw: string | number) => {
  if (typeof raw === "number") return Math.round(raw);
  const s = String(raw).trim().toUpperCase();
  const hasK = s.includes("K");
  // match first numeric token (supports decimals)
  const match = s.match(/[\d,.]+/);
  const num = match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  return hasK ? Math.round(num * 1000) : Math.round(num);
};

/* ---------------------------
   AboutPage Component
   --------------------------- */
const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState<CompanyStat[]>([]);

  useEffect(() => {
    // ensure top on mount
    window.scrollTo(0, 0);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    setStats(COMPANY_STATS);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const coreValues = [
    { icon: Star, title: "val_excellence", desc: "val_excellence_desc" },
    { icon: Lock, title: "val_discretion", desc: "val_discretion_desc" },
    { icon: Clock, title: "val_reliability", desc: "val_reliability_desc" },
    { icon: Shield, title: "val_safety", desc: "val_safety_desc" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-24">
      <SEO
        title={t('nav_about')}
        description={t('about_hero_subtitle')}
      />
      {/* Hero: asymmetric split — story copy left, quick stat counters right */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Breadcrumbs items={[{ label: t('nav_about') }]} className="mb-8 text-slate-500 dark:text-slate-400" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-3 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-slow"></span>
              {t('about_subtitle')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.15]">
              {t('about_hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-light max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t('about_hero_subtitle')}
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {(stats.length > 0 ? stats : COMPANY_STATS).slice(0, 4).map((stat: any, idx: number) => {
              const raw = stat.value ?? stat.raw ?? '0';
              const numeric = parseRawToNumber(raw);
              const label = stat.labelKey ? t(stat.labelKey) : (stat.label ?? '');
              return (
                <div
                  key={stat.id ?? idx}
                  className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-gold-500/40 transition-all duration-500 text-center"
                >
                  <CountUp
                    end={numeric}
                    raw={raw}
                    duration={2}
                    className="text-2xl md:text-3xl font-bold text-gold-500 mb-1"
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {t("about_story_title")}
              </h2>
            </div>

            <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              <p>{t("about_story_desc_1")}</p>
              <p>{t("about_story_desc_2")}</p>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'about_badge_fleet', label: 'Premium Fleet' },
                { key: 'about_badge_chauffeurs', label: 'Expert Chauffeurs' },
                { key: 'about_badge_support', label: '24/7 Support' },
                { key: 'about_badge_vip', label: 'VIP Treatment' }
              ].map((item) => (
                <div key={item.key} className="flex items-center space-x-3 rtl:space-x-reverse text-slate-800 dark:text-white font-medium p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="text-gold-500 w-6 h-6" />
                  <span>{t(item.key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative group perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-gold-400 to-gold-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-700 hover:rotate-y-2 h-[500px] lg:h-[600px]">
              <ImageWithFallback 
                src={t('about_image') ? transformImage(t('about_image')) : "/assets/about_new.png"} 
                alt="Our Story" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip (with CountUp animation for numbers only) */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {[
              { id: '1', value: '1K+', labelAr: 'عملاء', labelEn: 'Clients', icon: Users },
              { id: '2', value: '5+', labelAr: 'سنوات خبرة', labelEn: 'Years Exp', icon: Calendar },
              { id: '3', value: '30+', labelAr: 'موظفون', labelEn: 'Employees', icon: Briefcase },
              { id: '4', value: '50+', labelAr: 'حجوزات', labelEn: 'Bookings', icon: CheckCircle2 },
            ].map((stat) => {
              const Icon = stat.icon;
              const numeric = parseRawToNumber(stat.value);
              const label = useLanguage().language === 'ar' ? stat.labelAr : stat.labelEn;
              return (
                <div key={stat.id} className="relative group h-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                  <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold-500/50 transition-all duration-500 text-center flex flex-col items-center justify-center h-full min-h-[220px]">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-6 h-6 text-gold-500" />
                    </div>
                    <CountUp
                      end={numeric}
                      raw={stat.value}
                      duration={2}
                      className="text-4xl md:text-5xl font-bold text-white mb-2 font-sans tracking-tight"
                    />
                    <div className="text-sm md:text-base text-slate-300 font-medium leading-tight">
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50"></div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-10 lg:p-12 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
              <Target className="w-48 h-48 text-slate-900 dark:text-white" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gold-100 dark:bg-gold-900/30 rounded-2xl flex items-center justify-center mb-8 text-gold-500 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t("about_mission_title")}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{t("about_mission_desc")}</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-10 lg:p-12 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
              <Eye className="w-48 h-48 text-slate-900 dark:text-white" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gold-100 dark:bg-gold-900/30 rounded-2xl flex items-center justify-center mb-8 text-gold-500 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Eye className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t("about_vision_title")}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{t("about_vision_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-24 rounded-[3rem] mx-2 md:mx-6 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t("about_values_title")}</h2>
            <div className="w-24 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border-b-4 border-transparent hover:border-gold-500 transition-all duration-300 group hover:-translate-y-2">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-gold-500 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center group-hover:text-gold-500 transition-colors">
                    {t(val.title)}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed">{t(val.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
