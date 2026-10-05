import React, { useState, useRef, useEffect } from 'react';
import { countries, Country } from '../src/data/countries';
import { ChevronDown, Search } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  isAr: boolean;
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, isAr, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extract dial code and actual number from the value
  // We'll store value precisely as "+DialCodeXXXXXXXX"
  
  // Default to SA (+966)
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [localPhone, setLocalPhone] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When external value changes completely (e.g. form reset), update our local state
  useEffect(() => {
    if (!value) {
      setLocalPhone('');
      return;
    }
    
    // Attempt to match the country code from the start of the value
    const matchedCountry = countries.find(c => value.startsWith(c.dialCode));
    if (matchedCountry) {
      if (selectedCountry.code !== matchedCountry.code) {
        setSelectedCountry(matchedCountry);
      }
      const rawNumber = value.slice(matchedCountry.dialCode.length);
      if (localPhone !== rawNumber) {
        setLocalPhone(rawNumber);
      }
    } else {
      // If we don't match, just assume the whole thing is the number for safety
      if (localPhone !== value && !value.startsWith('+')) {
         setLocalPhone(value);
      }
    }
  }, [value]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    onChange(country.dialCode + localPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setLocalPhone(raw);
    onChange(selectedCountry.dialCode + raw);
  };

  const filteredCountries = countries.filter(c => 
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.nameAr.includes(searchQuery) ||
    c.dialCode.includes(searchQuery)
  );

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      
      {/* Dropdown Toggle inside Input */}
      <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-10' : 'left-0 pl-10'} flex items-center z-10`}>
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors focus:outline-none`}
        >
          <span className="text-xl leading-none" title={isAr ? selectedCountry.nameAr : selectedCountry.nameEn}>
            {selectedCountry.flag}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-300 font-bold" dir="ltr">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
      </div>

      <input 
        required 
        type="tel" 
        maxLength={15} 
        placeholder={placeholder || "5XXXXXXXX"} 
        dir="ltr"
        className={`w-full ${isAr ? 'pr-[160px] pl-4 text-right' : 'pl-[160px] pr-4'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-sans`}
        value={localPhone} 
        onChange={handlePhoneChange} 
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 top-full mt-2 w-full max-h-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col`}>
          
          {/* Search bar */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 relative">
             <Search size={16} className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} />
             <input 
               type="text" 
               className={`w-full bg-slate-50 dark:bg-slate-900/50 py-2 rounded-lg text-sm border-none focus:ring-1 focus:ring-gold-500 outline-none text-slate-900 dark:text-white ${isAr ? 'pr-8 pl-2' : 'pl-8 pr-2'}`}
               placeholder={isAr ? 'ابحث عن الدولة أو الرمز...' : 'Search country or code...'}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {filteredCountries.map((c) => (
               <button
                 key={c.code}
                 type="button"
                 onClick={() => handleCountrySelect(c)}
                 className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedCountry.code === c.code ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400' : 'text-slate-700 dark:text-slate-300'}`}
               >
                 <div className="flex items-center space-x-3 rtl:space-x-reverse">
                   <span className="text-xl">{c.flag}</span>
                   <span className="text-sm font-medium">{isAr ? c.nameAr : c.nameEn}</span>
                 </div>
                 <span className="text-sm opacity-70" dir="ltr">{c.dialCode}</span>
               </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500">
                {isAr ? 'لا توجد نتائج' : 'No results found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
