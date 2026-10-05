export interface Country {
  code: string;
  nameEn: string;
  nameAr: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات', dialCode: '+971', flag: '🇦🇪' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'عمان', dialCode: '+968', flag: '🇴🇲' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
  { code: 'LB', nameEn: 'Lebanon', nameAr: 'لبنان', dialCode: '+961', flag: '🇱🇧' },
  { code: 'SY', nameEn: 'Syria', nameAr: 'سوريا', dialCode: '+963', flag: '🇸🇾' },
  { code: 'IQ', nameEn: 'Iraq', nameAr: 'العراق', dialCode: '+964', flag: '🇮🇶' },
  { code: 'PS', nameEn: 'Palestine', nameAr: 'فلسطين', dialCode: '+970', flag: '🇵🇸' },
  { code: 'YE', nameEn: 'Yemen', nameAr: 'اليمن', dialCode: '+967', flag: '🇾🇪' },
  { code: 'SD', nameEn: 'Sudan', nameAr: 'السودان', dialCode: '+249', flag: '🇸🇩' },
  { code: 'LY', nameEn: 'Libya', nameAr: 'ليبيا', dialCode: '+218', flag: '🇱🇾' },
  { code: 'TN', nameEn: 'Tunisia', nameAr: 'تونس', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', nameEn: 'Algeria', nameAr: 'الجزائر', dialCode: '+213', flag: '🇩🇿' },
  { code: 'MA', nameEn: 'Morocco', nameAr: 'المغرب', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MR', nameEn: 'Mauritania', nameAr: 'موريتانيا', dialCode: '+222', flag: '🇲🇷' },
  { code: 'SO', nameEn: 'Somalia', nameAr: 'الصومال', dialCode: '+252', flag: '🇸🇴' },
  // AMERICAS
  { code: 'US', nameEn: 'United States', nameAr: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', nameEn: 'Canada', nameAr: 'كندا', dialCode: '+1', flag: '🇨🇦' },
  { code: 'MX', nameEn: 'Mexico', nameAr: 'المكسيك', dialCode: '+52', flag: '🇲🇽' },
  { code: 'BR', nameEn: 'Brazil', nameAr: 'البرازيل', dialCode: '+55', flag: '🇧🇷' },
  { code: 'AR', nameEn: 'Argentina', nameAr: 'الأرجنتين', dialCode: '+54', flag: '🇦🇷' },
  // EUROPE
  { code: 'GB', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', nameEn: 'France', nameAr: 'فرنسا', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', nameEn: 'Germany', nameAr: 'ألمانيا', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', nameEn: 'Italy', nameAr: 'إيطاليا', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', nameEn: 'Spain', nameAr: 'إسبانيا', dialCode: '+34', flag: '🇪🇸' },
  { code: 'RU', nameEn: 'Russia', nameAr: 'روسيا', dialCode: '+7', flag: '🇷🇺' },
  { code: 'TR', nameEn: 'Turkey', nameAr: 'تركيا', dialCode: '+90', flag: '🇹🇷' },
  { code: 'NL', nameEn: 'Netherlands', nameAr: 'هولندا', dialCode: '+31', flag: '🇳🇱' },
  { code: 'CH', nameEn: 'Switzerland', nameAr: 'سويسرا', dialCode: '+41', flag: '🇨🇭' },
  { code: 'SE', nameEn: 'Sweden', nameAr: 'السويد', dialCode: '+46', flag: '🇸🇪' },
  // ASIA/PACIFIC
  { code: 'CN', nameEn: 'China', nameAr: 'الصين', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', nameEn: 'India', nameAr: 'الهند', dialCode: '+91', flag: '🇮🇳' },
  { code: 'JP', nameEn: 'Japan', nameAr: 'اليابان', dialCode: '+81', flag: '🇯🇵' },
  { code: 'PK', nameEn: 'Pakistan', nameAr: 'باكستان', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', nameEn: 'Bangladesh', nameAr: 'بنغلاديش', dialCode: '+880', flag: '🇧🇩' },
  { code: 'ID', nameEn: 'Indonesia', nameAr: 'إندونيسيا', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', nameEn: 'Malaysia', nameAr: 'ماليزيا', dialCode: '+60', flag: '🇲🇾' },
  { code: 'PH', nameEn: 'Philippines', nameAr: 'الفلبين', dialCode: '+63', flag: '🇵🇭' },
  { code: 'KR', nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', dialCode: '+82', flag: '🇰🇷' },
  { code: 'AU', nameEn: 'Australia', nameAr: 'أستراليا', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', nameEn: 'New Zealand', nameAr: 'نيوزيلندا', dialCode: '+64', flag: '🇳🇿' },
  // AFRICA
  { code: 'ZA', nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', nameEn: 'Nigeria', nameAr: 'نيجيريا', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', nameEn: 'Kenya', nameAr: 'كينيا', dialCode: '+254', flag: '🇰🇪' },
];
