import type {
  Car,
  Service,
  Testimonial,
  Translations,
  BlogPost,
  Offer,
  PromoSlide,
} from "./types";

export const TRANSLATIONS: Translations = {
  // Navigation
  nav_home: { en: "Home", ar: "الرئيسية" },
  nav_about: { en: "About Us", ar: "من نحن" },
  nav_fleet: { en: "Fleet", ar: "الأسطول" },
  nav_services: { en: "Services", ar: "الخدمات" },
  nav_destinations: { en: "Destinations", ar: "الوجهات" },
  nav_tours: { en: "Tour Packages", ar: "الباقات السياحية" },
  nav_hotels: { en: "Hotels", ar: "الفنادق" },
  nav_flights: { en: "Flights", ar: "الطيران" },
  nav_offers: { en: "Offers", ar: "العروض" },
  nav_blog: { en: "Blog", ar: "المدونة" },
  nav_contact: { en: "Contact", ar: "اتصل بنا" },
  nav_book: { en: "Request Booking", ar: "طلب حجز" },
  nav_login: { en: "Login", ar: "تسجيل الدخول" },
  nav_profile: { en: "My Profile", ar: "حسابي" },
  nav_logout: { en: "Logout", ar: "تسجيل الخروج" },
  nav_menu: { en: "Menu", ar: "القائمة" },
  company_tagline: { en: "Travel & Tourism", ar: "للسفر والسياحة" },
  license_label: { en: "License", ar: "ترخيص" },
  license_number: { en: "23245", ar: "23245" },

  // Payment & Booking
  wa_booking_id: { en: "Booking ID", ar: "رقم الحجز" },
  label_payment_method: { en: "Payment Method", ar: "طريقة الدفع" },
  pay_inquiry_title: { en: "WhatsApp Inquiry", ar: "استفسار عبر واتساب" },
  pay_inquiry_desc: { en: "Book now and pay later after confirmation", ar: "احجز الآن وادفع لاحقاً بعد التأكيد" },
  pay_online_title: { en: "Online Payment", ar: "دفع إلكتروني آمن" },
  pay_online_desc: { en: "Pay now via Knet, Visa or Mastercard", ar: "ادفع الآن عبر كي نت، فيزا أو ماستركارد" },
  btn_pay_now: { en: "Pay Now", ar: "ادفع الآن" },
  label_payment_methods: { en: "Secure Payment Methods", ar: "وسائل دفع آمنة" },
  pay_success_title: { en: "Payment Successful!", ar: "تم الدفع بنجاح!" },
  pay_success_desc: { en: "Your booking has been confirmed. A confirmation email has been sent to your inbox.", ar: "تم تأكيد حجزك بنجاح. تم إرسال رسالة تأكيد إلى بريدك الإلكتروني." },
  pay_error_title: { en: "Payment Failed", ar: "فشل عملية الدفع" },
  pay_error_desc: { en: "We were unable to process your payment. Please try again or choose another payment method.", ar: "لم نتمكن من معالجة عملية الدفع. يرجى المحاولة مرة أخرى أو اختيار طريقة دفع أخرى." },
  pay_try_again: { en: "Try Booking Again", ar: "إعادة محاولة الحجز" },
  booking_confirmed_msg: { en: "Thank you for choosing Rahilty Almasiya.", ar: "شكراً لاختياركم رحلتي الماسية." },
  contact_support: { en: "Contact Support", ar: "تواصل مع الدعم" },
  
  // Payment Gateway Settings
  payment_gateway_enabled: { en: "false", ar: "false" },
  whatsapp_payment_enabled: { en: "true", ar: "true" },

  error_404_title: { en: "Page Not Found", ar: "الصفحة غير موجودة" },
  error_404_desc: { en: "The page you are looking for does not exist or has been moved.", ar: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها." },

  // WhatsApp
  whatsapp_label: { en: "Chat with us", ar: "تحدث معنا" },
  whatsapp_msg: {
    en: "Hello, I am interested in booking a luxury ride.",
    ar: "مرحباً، أنا مهتم بحجز سيارة فاخرة.",
  },
  whatsapp_offer_msg: {
    en: "Hello, I want to book this offer from Rahilati Almasiya website: ",
    ar: "مرحباً، أريد حجز هذا العرض من موقع رحلتي الماسية: ",
  },

  // Booking WhatsApp Templates
  wa_booking_intro: {
    en: "Hello, I would like to request a booking:",
    ar: "مرحباً، أود طلب حجز:",
  },
  wa_name: { en: "Name", ar: "الاسم" },
  wa_phone: { en: "Phone", ar: "الهاتف" },
  wa_email: { en: "Email", ar: "البريد" },
  wa_car: { en: "Vehicle", ar: "السيارة" },
  wa_date: { en: "Date", ar: "التاريخ" },
  wa_time: { en: "Time", ar: "الوقت" },
  wa_pickup: { en: "Pickup", ar: "موقع الاستلام" },
  wa_dropoff: { en: "Dropoff", ar: "الوجهة" },
  wa_message: { en: "Message", ar: "الرسالة" },
  label_return_date: { en: "Return Date", ar: "تاريخ العودة" },
  label_return_time: { en: "Return Time", ar: "وقت العودة" },
  booking_estimation: { en: "Price Estimation", ar: "تقدير السعر" },
  booking_per_day: { en: "per day", ar: "لكل يوم" },
  booking_driver_included: { en: "Chauffeur Included", ar: "شامل السائق" },
  booking_total: { en: "Estimated Total", ar: "الإجمالي التقديري" },
  label_with_driver: { en: "With Professional Chauffeur", ar: "مع سائق محترف" },

  // Hero
  hero_title: {
    en: "Discover Saudi Arabia in Absolute Comfort",
    ar: "اكتشف السعودية في قمة الراحة والفخامة",
  },
  hero_subtitle: {
    en: "From curated tours to private transport across Jeddah, Mecca, and Medina — your journey, your way.",
    ar: "من رحلات سياحية مصممة بعناية إلى نقل خاص بين جدة، مكة والمدينة، رحلتك بأسلوبك.",
  },
  cta_primary: { en: "Plan Your Trip", ar: "خطط لرحلتك" },
  cta_secondary: { en: "Explore Destinations", ar: "استكشف الوجهات" },
  hero_badge: {
    en: "Tourism & Travel • VIP Experience",
    ar: "سياحة وسفر • تجربة كبار الشخصيات",
  },

  // Promo Banner (Corporate)
  promo_banner_title: {
    en: "Elevate Your Business Travel",
    ar: "ارتقِ برحلات عملك",
  },
  promo_banner_subtitle: {
    en: "Join our exclusive corporate program for priority booking, monthly billing, and dedicated account management.",
    ar: "انضم إلى برنامج الشركات الحصري للحصول على أولوية الحجز، الفواتير الشهرية، وإدارة حساب مخصصة.",
  },
  promo_banner_cta: {
    en: "Join Corporate Program",
    ar: "انضم لبرنامج الشركات",
  },
  promo_vip_badge: { en: "Corporate VIP", ar: "كبار الشخصيات للشركات" },

  // Campaign Banner
  campaign_title: {
    en: "Experience the Extra Mile",
    ar: "نأخذك إلى أبعد مدى من الرفاهية",
  },
  campaign_subtitle: {
    en: "Book any SUV this week and receive a complimentary airport transfer upgrade.",
    ar: "احجز أي سيارة دفع رباعي هذا الأسبوع واحصل على ترقية مجانية لتوصيل المطار.",
  },
  campaign_cta: { en: "Claim Offer", ar: "احصل على العرض" },
  campaign_badge: { en: "Limited Time Offer", ar: "عرض لفترة محدودة" },

  // Partners
  partners_title: { en: "Success Partners", ar: "شركاء النجاح" },

  about_hero_title: {
    en: "Luxury Transport Redefined with Rahilty Almasiya",
    ar: "نحن شركة رحلتي الماسية بوابة العبور الفاخرة",
  },
  about_hero_subtitle: {
    en: "Where luxury, privacy and professional hospitality meet.",
    ar: "نعيد تعريف مفهوم النقل الخاص وخدمات الضيافة الراقية",
  },

  // Subtitle
  about_subtitle: { en: "Our Story", ar: "قصتنا" },

  // About Title
  about_title: {
    en: "Redefining Private Luxury Transportation",
    ar: "إعادة تعريف النقل الخاص الفاخر",
  },

  // About Description (الفترة التعريفية الأولى)
  about_desc: {
    en: "Rahilty Almasiya is the gateway to premium private transport and elevated hospitality. Founded to balance efficiency with luxurious travel, we specialize in providing elite chauffeured vehicles connecting clients to airports, luxury hotels, conferences and major events — ensuring seamless, comfortable arrivals worthy of their status.",
    ar: "نحن شركة رحلتي الماسية بوابة العبور الفاخرة التي تعيد تعريف مفهوم النقل الخاص وخدمات الضيافة الراقية. تأسسنا لنوازن بين الاحتياج للنقل الفعال والرغبة في تجربة سفر تتميز بالفخامة، الخصوصية، والاحترافية المطلقة. متخصصون حاليًا في توفير خدمات النقل بسيارات فاخرة مع أفضل وأمهر الكباتن المدربين، لربط عملائنا بالمطارات، الفنادق الراقية، المؤتمرات، والفعاليات الهامة، لضمان وصول سلس ومريح يليق بمكانتهم.",
  },

  // Story
  about_story_title: { en: "Our Story", ar: "قصتنا" },
  about_story_desc_1: {
    en: "Rahilty Almasiya was founded with a mission to elevate private transportation into a refined experience defined by luxury, privacy and professionalism.",
    ar: "تأسسنا لنوازن بين الاحتياج للنقل الفعال وتجربة سفر تتميز بالفخامة، الخصوصية، والاحترافية المطلقة.",
  },
  about_story_desc_2: {
    en: "Today we serve clients across the Kingdom with a premium fleet and highly trained chauffeurs, ensuring smooth and dignified transport for airports, hotels, conferences and major events.",
    ar: "نربط عملائنا بالمطارات، الفنادق الراقية، المؤتمرات، والفعاليات الهامة، لضمان وصول سلس ومريح يليق بمكانتهم.",
  },

  // Mission
  about_mission_title: { en: "Our Mission", ar: "رسالتنا" },
  about_mission_desc: {
    en: "To provide a seamless and luxurious travel experience by employing the best chauffeurs, maintaining premium vehicles, and delivering service that becomes an essential part of a client's successful journey.",
    ar: "توفير تجربة تنقل سلسة وفخمة لعملائنا من المسافرين الباحثين عن التميز. نحن نلتزم بتوظيف أفضل السائقين وتجهيز أفخم المركبات، وتقديم خدمة تتجاوز مجرد النقل لتصبح جزءًا لا يتجزأ من رحلة العميل المريحة والناجحة.",
  },

  // Placeholder
  placeholder_name: { en: "e.g. John Doe", ar: "مثال: يوسف محمد" },
  placeholder_phone: { en: "e.g. +966 50 123 4567", ar: "مثال: 966501234567+" },
  placeholder_email: { en: "e.g. user@example.com", ar: "مثال: user@example.com" },
  placeholder_message: { en: "How can we help you?", ar: "كيف يمكننا مساعدتك؟" },

  // Vision
  about_vision_title: { en: "Our Vision", ar: "رؤيتنا" },
  about_vision_desc: {
    en: "To become the first and most trusted choice for luxury transportation and integrated premium travel solutions in Saudi Arabia — setting the golden standard through a blend of modern technology and exceptional human hospitality.",
    ar: "أن نكون الخيار الأول والموثوق لخدمات النقل الفاخر والحلول المتكاملة للسفر الراقي في المملكة العربية السعودية، وأن نرسم المعيار الذهبي للخدمة الشخصية والاحترافية التي تمزج بين التكنولوجيا الحديثة واللمسة الإنسانية الراقية.",
  },

  // Core Values Section
  about_values_title: { en: "Our Core Values", ar: "قيمنا الجوهرية" },

  val_excellence: { en: "Absolute Professionalism", ar: "الاحترافية المطلقة" },
  val_excellence_desc: {
    en: "Our commitment is reflected in the appearance and conduct of our chauffeurs, ensuring total professionalism and discretion.",
    ar: "يظهر التزامنا في المظهر اللائق لسائقينا، وفي السرية التامة التي نوليها لبيانات وخصوصية عملائنا.",
  },

  val_discretion: { en: "Commitment & Precision", ar: "الالتزام والدقة" },
  val_discretion_desc: {
    en: "We respect our clients’ time and guarantee punctuality in every trip.",
    ar: "احترام وقت العميل هو أولويتنا، ونضمن الوصول والانطلاق في المواعيد المحددة بدقة متناهية.",
  },

  val_reliability: { en: "Luxury & Quality", ar: "الفخامة والجودة" },
  val_reliability_desc: {
    en: "Our fleet is carefully selected to ensure comfort, safety and elegance.",
    ar: "اختيار مركباتنا يتم بعناية فائقة لضمان أعلى معايير الراحة والأمان والأناقة.",
  },

  val_safety: { en: "Transparency & Trust", ar: "الشفافية والثقة" },
  val_safety_desc: {
    en: "We build long-term relationships through clarity, honesty and consistent service.",
    ar: "بناء علاقات طويلة الأمد مع عملائنا تقوم على الوضوح التام والمصداقية في التعامل والأسعار.",
  },

  val_personal_service: { en: "Personalized Service", ar: "الخدمة الشخصية" },
  val_personal_service_desc: {
    en: "We understand client needs and deliver tailored experiences with attention to every detail.",
    ar: "فهم احتياجات العميل وتقديم خدمة مصممة خصيصًا له، مع الاهتمام بأدق التفاصيل.",
  },

  // Objectives
  about_objectives_title: { en: "Our Objectives", ar: "أهدافنا" },
  about_objectives: {
    en: `
Actively contribute to Saudi Vision 2030 through expansion and service excellence.
Strengthen customer trust through consistent, high-quality service.
Expand coverage across major cities and regions in the Kingdom.
Adopt advanced technologies for easier booking and monitoring.
Build a highly trained team aligned with top hospitality and safety standards.
Operational excellence with accurate scheduling and world-class fleet maintenance.
Exceed expectations with memorable, detail-oriented service.
Strategic growth to transform into a complete luxury travel platform (hotels, private jets, premium bookings).
  `,
    ar: `
نهدف إلى المشاركة الفاعلة في تحقيق أهداف رؤية المملكة 2030 من خلال الانتشار والتوسع جنبًا إلى جنب مع المحافظة على جودة الخدمات المقدمة.
تعزيز ثقة العملاء من خلال تقديم خدمة ثابتة وعالية الجودة.
التوسع الجغرافي داخل المملكة لتغطية أكبر عدد من المدن والمناطق.
اعتماد تقنيات حديثة لتسهيل الحجز والمتابعة.
بناء فريق عمل متمرس ومؤهل بأعلى معايير الضيافة والسلامة.
التميز التشغيلي: تحقيق أعلى مستويات الدقة والالتزام في المواعيد، وضمان صيانة الأسطول وفقًا لأرقى المعايير العالمية.
تجاوز التوقعات: تقديم خدمة نقل لا تُنسى، تترك انطباعًا دائمًا بالجودة والاهتمام بالتفاصيل الدقيقة.
التوسع الاستراتيجي: لتصبح رحلتي الماسية منصة شاملة للسفر الفاخر تشمل حجز الفنادق الفخمة ورحلات الطيران الخاصة.
  `,
  },

  // Why Choose Us
  about_why_title: {
    en: "Why Choose Rahilty Almasiya?",
    ar: "ليش تختار رحلتي الماسية؟",
  },
  about_why_desc: {
    en: "Booking with Rahilty Almasiya is fast and effortless — choose your preferred vehicle, select the duration (hourly, half-day or full-day), and enjoy smooth travel across Jeddah, Mecca or Medina. Your comfort is our priority.",
    ar: "مع رحلتي الماسية، حجز السيارات صار أسهل وأسرع! اختار سيارتك المفضلة، حدد الوقت اللي يناسبك — بالساعة، نصف يوم أو يوم كامل — وسافر على راحتك لأي مكان في جدة، مكة أو المدينة. راحتك أولويتنا، وتجربتك معنا دائمًا ممتعة.",
  },

  // City Transfer Specials
  transfer_jeddah: {
    en: "Book your transfer in Jeddah — hourly, half-day or full-day.",
    ar: "حجز موصلات لجدة — اختر سيارتك واستمتع برحلة مريحة وسهلة.",
  },
  transfer_mecca: {
    en: "Premium transfer service to Mecca for a smooth and comfortable journey.",
    ar: "حجز موصلات مكة المكرمة — رحلة مريحة وسهلة حسب رغبتك.",
  },
  transfer_medina: {
    en: "Reliable and elegant transfers to Medina.",
    ar: "حجز موصلات المدينة المنورة — رحلة سهلة ومريحة لك.",
  },

  // Badges
  about_badge_fleet: { en: "Premium Fleet", ar: "أسطول فاخر" },
  about_badge_chauffeurs: { en: "Expert Chauffeurs", ar: "سائقون خبراء" },
  about_badge_support: { en: "24/7 Support", ar: "دعم 24/7" },
  about_badge_vip: { en: "VIP Treatment", ar: "معاملة كبار الشخصيات" },

  stat_trips: {
    en: "Daily Bookings",
    ar: "حجوزات يومية",
  },

  stat_staff: {
    en: "Work Team",
    ar: "فريق عمل",
  },

  stat_years: {
    en: "Years Experience",
    ar: "سنوات خبرة",
  },

  stat_partners: {
    en: "Happy Clients",
    ar: "عملاء",
  },

  // Services Page
  services_title: { en: "Our Services", ar: "خدماتنا" },
  services_subtitle: {
    en: "Explore our newest premium offerings.",
    ar: "استكشف أحدث عروضنا المميزة.",
  },
  service_btn_learn: { en: "View Details", ar: "عرض التفاصيل" },
  services_hero_title: { en: "Excellence in Motion", ar: "التميز في الحركة" },
  services_hero_desc: {
    en: "Rahilty Almasiya offers more than just transportation; we provide a seamless extension of your lifestyle. Whether it's a critical business meeting, a red-carpet event, or a relaxing airport transfer, our bespoke services are tailored to meet your exacting standards.",
    ar: "تقدم رحلتي الماسية أكثر من مجرد وسيلة نقل؛ نحن نوفر امتداداً سلساً لأسلوب حياتك. سواء كان اجتماع عمل حاسم، أو حدث سجادة حمراء، أو نقل مريح للمطار، فإن خدماتنا المصممة خصيصاً تلبي معاييرك الدقيقة.",
  },

  // Specific Services Data
  //Airport Booking service
  services_exec_airport_title: {
    en: "Executive Airport Booking",
    ar: "خدمة حجز المطار التنفيذي",
  },
  services_exec_airport_desc: {
    en: "Exclusive executive airport service including fast-track procedures, priority lanes, lounge access, and personal escort.",
    ar: "خدمة مطار تنفيذية شاملة تتضمن مسار سريع، قنوات أولوية، دخول الصالات التنفيذية، ومرافق خاص.",
  },

  feat_priority_lane: { en: "Priority Lane", ar: "مسار أولوية" },
  feat_lounge_access: { en: "Lounge Access", ar: "دخول الصالة التنفيذية" },
  feat_greeting_escort: { en: "Greeting Escort", ar: "مرافق استقبال" },
  feat_fast_track: { en: "Fast Track", ar: "المسار السريع" },
  //Hotel Booking service
  services_hotel_booking_title: {
    en: "Hotel Booking – Makkah & Madinah",
    ar: "خدمة حجز فنادق مكة والمدينة",
  },
  services_hotel_booking_desc: {
    en: "Premium hotel reservation service in Makkah and Madinah with special corporate rates and VIP check-in support.",
    ar: "خدمة حجز فنادق مميزة في مكة والمدينة بأسعار تفضيلية ودعم خاص لإجراءات تسجيل الدخول.",
  },

  feat_5star_hotels: { en: "5-Star Hotels", ar: "فنادق خمس نجوم" },
  feat_special_rates: { en: "Special Rates", ar: "أسعار تفضيلية" },
  feat_makkah_madinah: {
    en: "Makkah & Madinah Options",
    ar: "خيارات مكة والمدينة",
  },
  feat_vip_handling: { en: "VIP Handling", ar: "خدمة كبار الشخصيات" },
  //airport service
  services_airport_title: { en: "Jeddah Transfers", ar: "حجز موصلات — جدة" },
  services_airport_desc: {
    en: "Comfortable and reliable transfers across Jeddah — book by the hour, half-day or full-day. Airport pickups, hotel transfers and city rides.",
    ar: "خدمات موثوقة ومريحة في جدة — احجز بالساعة، نصف يوم أو يوم كامل. تشمل الاستقبال بالمطار، التوصيل للفنادق والتنقل داخل المدينة.",
  },
  feat_flight_tracking: { en: "Flight Tracking", ar: "تتبع الرحلات" },
  feat_meet_greet: { en: "Meet & Greet", ar: "خدمة الاستقبال والترحيب" },
  feat_luggage: { en: "Luggage Assistance", ar: "مساعدة في الحقائب" },
  feat_waiting: { en: "60 Mins Free Waiting", ar: "60 دقيقة انتظار مجاني" },
  faq_cost_q: {
    en: "How is the service cost calculated?",
    ar: "ماهي طريقة احتساب تكلفة الخدمة ؟",
  },
  faq_cost_a: {
    en: "Prices vary depending on the booking category, including vehicle type, route, and selected trip duration. The cost is calculated by our reservation staff based on the chosen category.",
    ar: "تختلف الأسعار بحسب فئة الحجز المطلوبة من حيث ( نوعية السيارة – خط سير الرحلة – مدة الرحلة التي تم اختيارها ). ويتم احتسابها عن طريق موظف الحجز بحسب الفئة.",
  },

  faq_payment_q: {
    en: "What payment options are available?",
    ar: "ماهي خيارات الدفع المتاحة ؟",
  },
  faq_payment_a: {
    en: "You may pay via bank transfer to the company account, online payment, or through various bank cards using the POS device available with the chauffeur.",
    ar: "يمكن الدفع عن طريق ( التحويل البنكي على حساب الشركة – او الدفع اونلاين – او الدفع بالبطاقات البنكية المختلفة عن طريق جهاز نقاط البيع الموجود مع السائق ).",
  },

  faq_booking_q: {
    en: "How can I book a car with a chauffeur and how long does confirmation take?",
    ar: "كيف يمكنني حجز سيارة مع سائق ؟ وكم مدة التأكيد ؟",
  },
  faq_booking_a: {
    en: "You can book through the website, by phone, or via WhatsApp. Bookings are usually confirmed immediately or within a maximum of 30 minutes.",
    ar: "يمكن الحجز عن طريق الموقع الإلكتروني او عن طريق الاتصال التليفوني وكذلك عن طريق التواصل عبر تطبيق الواتساب. وعادة مايتم تأكيد الحجز فورياً او في خلال مدة لا تتجاوز ثلاثون دقيقة كحد اقصى.",
  },

  faq_childseat_q: {
    en: "Can I request a child seat?",
    ar: "هل يمكن طلب مقعد للأطفال ؟",
  },
  faq_childseat_a: {
    en: "Yes, we provide dedicated child seats upon request. Please inform the reservation staff during the booking process.",
    ar: "نعم لدينا مقاعد مخصصة للأطفال يتم اضافتها بحسب الطلب ( برجاء ابلاغ موظف الحجز اثناء عملية الحجز ).",
  },

  faq_wait_q: {
    en: "Can the chauffeur wait for me during my tours or meetings?",
    ar: "هل يمكن للسائق ان ينتظرني اثناء جولاتي او اجتماعاتي ؟",
  },
  faq_wait_a: {
    en: "Yes, the chauffeur can wait depending on the booking type selected.",
    ar: "نعم بالتأكيد يمكن للسائق الانتظار بحسب حالة الحجز التي تم اختيارها.",
  },

  faq_languages_q: {
    en: "Do the chauffeurs speak any language other than Arabic?",
    ar: "هل يتحدث السائقون لغة اخرى غير اللغة العربية ؟",
  },
  faq_languages_a: {
    en: "Yes, our chauffeurs speak English in addition to Arabic.",
    ar: "نعم يتحدث السائقون اللغة الإنجليزية بجانب اللغة العربية.",
  },

  faq_cancel_q: {
    en: "What is the cancellation and booking modification policy?",
    ar: "ماهي سياسة الإلغاء وتعديل الحجز ؟",
  },
  faq_cancel_a: {
    en: "You may cancel or modify your booking without fees and receive a full refund if done at least 12 hours before the trip time.",
    ar: "يمكن الإلغاء او تعديل الحجز بدون خصم رسوم واسترداد كامل المبلغ المدفوع اذا تم ذلك قبل ١٢ ساعة كحد اقصى من موعد الرحلة.",
  },

  faq_disability_q: {
    en: "Do you provide vehicles equipped for people with special needs?",
    ar: "هل لديكم سيارات مجهزة لذوي الاحتياجات الخاصة ؟",
  },
  faq_disability_a: {
    en: "Yes, we have some vehicles equipped for people with special needs. (Prior booking is required and must be communicated during reservation.)",
    ar: "نعم لدينا بعض السيارات مجهزة لخدمة ذوي الاحتياجات الخاصة ( يجب ابلاغ موظف الحجز بذلك اثناء عملية الحجز – تتطلب الحجز المسبق ).",
  },

  services_business_title: {
    en: "Makkah Transfers",
    ar: "حجز موصلات — مكة المكرمة",
  },
  services_business_desc: {
    en: "Premium transfer services in Makkah with meet & greet, luggage assistance and private transport options for pilgrims and visitors.",
    ar: "خدمات موثوقة ومميزة في مكة — استقبال خاص (Meet & Greet)، مساعدة بالأمتعة وخيارات نقل خاصة للحجاج والزوار.",
  },
  feat_wifi: { en: "Wi-Fi Onboard", ar: "واي فاي مجاني" },
  feat_privacy: { en: "Privacy Partition", ar: "حاجز خصوصية" },
  feat_newspaper: { en: "Daily Newspapers", ar: "صحف يومية" },
  feat_refreshments: { en: "Refreshments", ar: "مرطبات ومياه" },

  services_chauffeur_title: {
    en: "Al Madinah Transfers",
    ar: "حجز موصلات — المدينة المنورة",
  },
  services_chauffeur_desc: {
    en: "Safe and comfortable transfers in Al Madinah — hourly, half-day or full-day options with professional chauffeurs.",
    ar: "تنقلات آمنة ومريحة في المدينة المنورة — خدمات بالساعة، نصف يوم أو يوم كامل مع سائقين محترفين وملتزمين.",
  },
  feat_uniform: { en: "Uniformed Chauffeurs", ar: "سائقون بزي رسمي" },
  feat_multi_lang: { en: "Multilingual", ar: "متحدثون لغات متعددة" },
  feat_security: { en: "Security Trained", ar: "تدريب أمني" },
  feat_discreet: { en: "Discreet Service", ar: "خدمة سرية" },

  services_vip_title: {
    en: "VIP & Executive Service",
    ar: "خدمات كبار الشخصيات",
  },
  services_vip_desc: {
    en: "Exclusive VIP transport with premium vehicles, personalized concierge and discreet professional chauffeurs for special occasions and executive travel.",
    ar: "خدمة كبار الشخصيات بأسطول فاخر، كونسييرج مخصص وسائقون محترفون يقدمون تجربة راقية وخاصة للمناسبات ورحلات الأعمال.",
  },
  feat_flexible: { en: "Flexible Route", ar: "مسار مرن" },
  feat_hourly: { en: "Hourly Billing", ar: "حساب بالساعة" },
  feat_concierge: { en: "Concierge Service", ar: "خدمة كونسيرج" },
  feat_premium_fleet: { en: "Premium Vehicles", ar: "مركبات فاخرة" },

  services_wedding_title: {
    en: "Professional Chauffeur",
    ar: "سائق خاص محترف",
  },
  services_wedding_desc: {
    en: "Highly trained, uniformed chauffeurs who prioritize punctuality, privacy and a courteous in-car experience.",
    ar: "سائقون مدرّبون وبلباس رسمي يراعون الدقة في المواعيد، خصوصية العميل ولباقة التعامل داخل المركبة.",
  },
  feat_decoration: { en: "Ribbon Decoration", ar: "زينة شرائط" },
  feat_red_carpet: { en: "Red Carpet", ar: "سجاد أحمر" },
  feat_champagne: { en: "Champagne Service", ar: "خدمة مشروبات احتفالية" },
  feat_plate: { en: "Just Married Plate", ar: "لوحة زفاف خاصة" },

  services_family_title: {
    en: "Family & Group Transfers",
    ar: "خدمات عائلية ومجموعات",
  },
  services_family_desc: {
    en: "Spacious vehicles, child seats and onboard entertainment options to ensure comfort and safety for families and groups.",
    ar: "مركبات واسعة ومقاعد أطفال وخيارات ترفيه داخلية لضمان راحة وسلامة العائلات والمجموعات أثناء التنقل.",
  },
  feat_child_seats: { en: "Child Seats", ar: "مقاعد أطفال" },
  feat_space: { en: "Spacious Interior", ar: "مقصورة واسعة" },
  feat_entertainment: { en: "Entertainment System", ar: "نظام ترفيهي" },
  feat_safe_driving: { en: "Safe Driving", ar: "قيادة آمنة" },

  // Service Detail Page
  service_overview: { en: "Overview", ar: "نظرة عامة" },
  service_features: { en: "Key Features", ar: "الميزات الرئيسية" },
  service_gallery: { en: "Gallery", ar: "المعرض" },
  service_faq: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  faq_title: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  faq_subtitle: {
    en: "Find answers to common questions about our services",
    ar: "اعثر على إجابات للأسئلة الشائعة حول خدماتنا"
  },
  related_services: { en: "Related Services", ar: "خدمات ذات صلة" },

  // Destinations
  destinations_title: { en: "Explore Our Destinations", ar: "استكشف وجهاتنا" },
  destinations_subtitle: {
    en: "Discover the most iconic destinations across the Kingdom, curated for an unforgettable journey.",
    ar: "اكتشف أبرز الوجهات في المملكة، مصممة خصيصاً لرحلة لا تُنسى."
  },
  destination_overview: { en: "About This Destination", ar: "عن هذه الوجهة" },
  destination_highlights: { en: "Highlights", ar: "أبرز المعالم" },
  destination_gallery: { en: "Gallery", ar: "المعرض" },
  destination_not_found: { en: "Destination not found", ar: "الوجهة غير موجودة" },
  destination_tours: { en: "Tour Packages for this Destination", ar: "الباقات السياحية لهذه الوجهة" },
  destination_no_tours: { en: "No tour packages available yet for this destination.", ar: "لا توجد باقات سياحية متاحة حالياً لهذه الوجهة." },
  related_destinations: { en: "Other Destinations", ar: "وجهات أخرى" },
  no_destinations_found: { en: "No destinations available at the moment.", ar: "لا توجد وجهات متاحة حالياً." },
  view_tours_cta: { en: "View Tour Packages", ar: "عرض الباقات السياحية" },

  // Tour Packages
  tours_title: { en: "Curated Tour Packages", ar: "باقات سياحية مختارة" },
  tours_subtitle: {
    en: "Handpicked itineraries that blend comfort, culture, and adventure.",
    ar: "برامج رحلات مختارة بعناية تجمع بين الراحة والثقافة والمغامرة."
  },
  tour_overview: { en: "Package Overview", ar: "نظرة عامة على الباقة" },
  tour_itinerary: { en: "Itinerary", ar: "برنامج الرحلة" },
  tour_includes: { en: "What's Included", ar: "ما يشمله البرنامج" },
  tour_gallery: { en: "Gallery", ar: "المعرض" },
  tour_duration: { en: "Duration", ar: "المدة" },
  tour_price: { en: "Price", ar: "السعر" },
  tour_not_found: { en: "Tour package not found", ar: "الباقة السياحية غير موجودة" },
  tour_book_cta: { en: "Book This Tour", ar: "احجز هذه الرحلة" },
  related_tours: { en: "Other Tour Packages", ar: "باقات سياحية أخرى" },
  no_tours_found: { en: "No tour packages available at the moment.", ar: "لا توجد باقات سياحية متاحة حالياً." },
  filter_all_destinations: { en: "All Destinations", ar: "كل الوجهات" },
  day_label: { en: "Day", ar: "اليوم" },
  nights_label: { en: "Nights", ar: "ليالٍ" },
  days_label: { en: "Days", ar: "أيام" },
  why_choose_us: { en: "Why Choose Us?", ar: "لماذا تختارنا؟" },
  book_service_cta: {
    en: "Ready to Experience Luxury?",
    ar: "هل أنت مستعد لتجربة الرفاهية؟",
  },
  contact_for_booking: { en: "Contact for Booking", ar: "تواصل للحجز" },
  service_duration: { en: "Duration", ar: "المدة" },
  service_duration_val: {
    en: "Flexible / Hourly / Daily",
    ar: "مرنة / بالساعة / يومي",
  },
  service_availability: { en: "Availability", ar: "التوفر" },
  service_availability_val: {
    en: "24/7 By Appointment",
    ar: "24/7 حسب الموعد",
  },
  service_starting_from: { en: "Request Quote", ar: "اطلب عرض سعر" },
  service_rate_unit: { en: "/ hour", ar: "/ ساعة" },

  // Fleet
  fleet_title: { en: "Our Fleet", ar: "أسطولنا" },
  fleet_subtitle: {
    en: "Choose from our collection of world-class vehicles.",
    ar: "اختر من مجموعتنا من السيارات ذات المستوى العالمي.",
  },
  filter_all: { en: "All", ar: "الكل" },
  filter_luxury: { en: "Luxury", ar: "فاخرة" },
  filter_suv: { en: "SUV", ar: "دفع رباعي" },
  filter_van: { en: "Van", ar: "فان" },
  filter_sedan: { en: "Sedan", ar: "سيدان" },
  filter_economy: { en: "Economy", ar: "اقتصادية" },
  filter_by: { en: "Filter By:", ar: "تصفية حسب:" },
  car_passengers: { en: "Passengers", ar: "ركاب" },
  car_luggage: { en: "Luggage", ar: "حقائب" },
  price_day: { en: "", ar: "" }, // Removed
  book_vehicle: { en: "Request Booking", ar: "طلب حجز" },
  car_starting_from: { en: "Starting from", ar: "يبدأ من" },

  // Car Specs & Features keys
  spec_engine: { en: "Engine", ar: "المحرك" },
  spec_transmission: { en: "Transmission", ar: "ناقل الحركة" },
  spec_fuel: { en: "Fuel Type", ar: "نوع الوقود" },
  spec_speed: { en: "0-100 km/h", ar: "0-100 كم/س" },
  spec_year: { en: "Year", ar: "السنة" },
  specifications_title: { en: "Specifications", ar: "المواصفات الفنية" },

  val_petrol: { en: "Petrol", ar: "بنزين" },
  val_diesel: { en: "Diesel", ar: "ديزل" },
  val_auto: { en: "Automatic", ar: "أوتوماتيك" },
  val_v8: { en: "V8 Biturbo", ar: "محرك V8 تيربو" },
  val_twin_turbo: { en: "TwinPower Turbo", ar: "تيربو ثنائي الطاقة" },
  val_speed_250: { en: "250 km/h", ar: "250 كم/س" },

  feat_massage: { en: "Massage Seats", ar: "مقاعد تدليك" },
  feat_rear_ent: { en: "Rear Entertainment", ar: "شاشات خلفية" },
  feat_shades: { en: "Privacy Shades", ar: "ستائر خصوصية" },
  feat_gesture: { en: "Gesture Control", ar: "تحكم بالإشارة" },
  feat_lounge: { en: "Executive Lounge", ar: "مقاعد استرخاء" },
  feat_sound: { en: "Premium Sound", ar: "نظام صوتي فاخر" },
  feat_roof: { en: "Panoramic Roof", ar: "سقف بانورامي" },
  feat_conf: { en: "Conference Seating", ar: "مقاعد اجتماعات" },
  feat_doors: { en: "Electric Sliding Doors", ar: "أبواب كهربائية" },
  feat_table: { en: "Table Package", ar: "طاولات قابلة للطي" },
  feat_starlight: { en: "Starlight Headliner", ar: "سقف نجوم" },
  feat_cooler: { en: "Champagne Cooler", ar: "مبرد مشروبات" },
  feat_suicide: { en: "Suicide Doors", ar: "أبواب متعاكسة" },
  feat_luxury: { en: "Ultimate Luxury", ar: "فخامة مطلقة" },
  feat_offroad: { en: "Off-road Capability", ar: "قدرات الطرق الوعرة" },
  feat_oled: { en: "OLED Display", ar: "شاشة OLED" },
  feat_cruise: { en: "Super Cruise", ar: "نظام تثبيت سرعة" },
  feat_massive: { en: "Massive Space", ar: "مساحة هائلة" },
  feat_comfort: { en: "Comfort Interior", ar: "راحة داخلية" },

  car_features_title: { en: "Luxury Features", ar: "مزايا الفخامة" },
  car_inclusions_title: { en: "Service Inclusions", ar: "مميزات الخدمة" },
  car_desc_s_class: {
    en: "The Mercedes-Benz S-Class sets the standard for luxury sedans. With its elegant design, cutting-edge technology, and unparalleled comfort, it is the ultimate choice for VIP transport.",
    ar: "تضع مرسيدس بنز الفئة-S معياراً لسيارات السيدان الفاخرة. بفضل تصميمها الأنيق وتقنياتها المتطورة وراحتها التي لا تضاهى، فهي الخيار الأمثل لنقل كبار الشخصيات.",
  },
  car_desc_bmw7: {
    en: "The BMW 7 Series combines supreme performance with executive luxury. Enjoy a smooth, dynamic ride with spacious interiors and advanced entertainment systems.",
    ar: "تجمع سيارة بي إم دبليو الفئة السابعة بين الأداء الفائق والفخامة التنفيذية. استمتع برحلة سلسة وديناميكية مع تصميمات داخلية واسعة وأنظمة ترفيه متقدمة.",
  },
  car_desc_v_class: {
    en: "For group travel without compromise, the Mercedes V-Class offers versatility and style. Perfect for corporate teams, family airport transfers, and delegations.",
    ar: "للسفر الجماعي دون مساومة، تقدم مرسيدس V-Class تنوعاً وأناقة. مثالية لفرق الشركات، والنقل العائلي للمطارات، والوفود.",
  },
  car_desc_generic: {
    en: "Experience the pinnacle of automotive engineering and luxury. This vehicle is maintained to the highest standards to ensure your safety and comfort.",
    ar: "جرب قمة هندسة السيارات والرفاهية. يتم صيانة هذه السيارة وفقاً لأعلى المعايير لضمان سلامتك وراحتك.",
  },

  highlight_chauffeur: { en: "Professional Chauffeur", ar: "سائق محترف" },
  highlight_chauffeur_desc: {
    en: "Expertly trained drivers",
    ar: "سائقون مدربون بخبرة",
  },
  highlight_vip: { en: "VIP Service", ar: "خدمة كبار الشخصيات" },
  highlight_vip_desc: {
    en: "Priority support & privacy",
    ar: "أولوية الدعم والخصوصية",
  },
  highlight_247: { en: "24/7 Support", ar: "دعم 24/7" },
  highlight_247_desc: { en: "Always here for you", ar: "نحن هنا لأجلك دائماً" },
  highlight_luxury: { en: "Luxury Experience", ar: "تجربة فاخرة" },
  highlight_luxury_desc: {
    en: "Top-tier fleet quality",
    ar: "أعلى جودة للأسطول",
  },

  car_daily_rate: { en: "Daily Rate", ar: "السعر اليومي" },
  car_best_price: { en: "Best Price Guarantee", ar: "ضمان أفضل سعر" },
  car_whatsapp_btn: { en: "WhatsApp", ar: "واتساب" },
  car_need_help: { en: "Need help?", ar: "تحتاج مساعدة؟" },
  car_you_might_like: { en: "You Might Also Like", ar: "قد يعجبك أيضاً" },
  car_official: { en: "Official Fleet", ar: "أسطول رسمي" },
  car_route_rates_title: { en: "Standard Transport Rates", ar: "أسعار التوصيل الثابتة" },
  car_not_found: { en: "Vehicle not found", ar: "السيارة غير موجودة" },
  car_from: { en: "From", ar: "من" },
  car_to: { en: "To", ar: "إلى" },
  car_price: { en: "Price", ar: "السعر" },
  car_sar: { en: "SAR", ar: "ريال" },
  car_book_now: { en: "Book Now", ar: "احجز الآن" },
  car_route_inquiry: { en: "I want to inquire about the route from {from} to {to} for {car}", ar: "أريد الاستفسار عن توصيلة من {from} إلى {to} لسيارة {car}" },
  car_inquiry_msg: { en: "Hello, I would like to inquire about booking: {car}", ar: "مرحباً، أريد الاستفسار عن حجز سيارة: {car}" },
  car_reviews: { en: "Reviews", ar: "التقييمات" },
  car_no_reviews: { en: "No reviews yet. Be the first to share your experience!", ar: "لا توجد تقييمات بعد. كن أول من يشارك تجربته!" },
  car_write_review: { en: "Write a Review", ar: "أضف تقييمك" },
  car_review_desc: { en: "Share your experience with this vehicle to help others make a better choice.", ar: "شارك تجربتك مع هذه السيارة لمساعدة الآخرين في اتخاذ قرار أفضل." },
  review_rating: { en: "Your Rating", ar: "تقييمك" },
  review_comment: { en: "Your Comment", ar: "تعليقك" },
  review_placeholder: { en: "Tell us about your trip...", ar: "أخبرنا عن رحلتك..." },
  btn_submit_review: { en: "Submit Review", ar: "إرسال التقييم" },
  review_login_required: { en: "Please login to add a review", ar: "يرجى تسجيل الدخول لإضافة تقييم" },
  common_sending: { en: "Sending...", ar: "جاري الإرسال..." },

  // Offers
  offers_title: { en: "Exclusive Offers", ar: "عروض حصرية" },
  offers_header_desc: {
    en: "Exclusive deals for your next luxury journey.",
    ar: "صفقات حصرية لرحلتك الفاخرة القادمة.",
  },
  offer_weekend_title: { en: "Weekend Getaway", ar: "عطلة نهاية الأسبوع" },
  offer_weekend_desc: {
    en: "Luxury weekend escape package.",
    ar: "باقة عطلة نهاية الأسبوع الفاخرة.",
  },
  offer_weekend_full: {
    en: "Escape the city with our exclusive Weekend Getaway package. Enjoy 3 days of luxury driving with special rates on any SUV or Convertible. Perfect for road trips to Hatta, Jebel Jais, or a relaxing staycation.",
    ar: "اهرب من صخب المدينة مع باقة عطلة نهاية الأسبوع الحصرية. استمتع بـ 3 أيام من القيادة الفاخرة بأسعار خاصة على أي سيارة دفع رباعي أو مكشوفة. مثالية للرحلات البرية إلى حتا، جبل جيس، أو إقامة مريحة.",
  },

  offer_airport_title: { en: "Airport VIP", ar: "كبار الشخصيات للمطار" },
  offer_airport_desc: {
    en: "Free upgrade to S-Class for return trips.",
    ar: "ترقية مجانية إلى S-Class لرحلات العودة.",
  },
  offer_airport_full: {
    en: "Experience the ultimate comfort with our Airport VIP package. Book a standard airport transfer and receive a complimentary upgrade to the luxurious Mercedes-Benz S-Class for your return trip.",
    ar: "جرب أقصى درجات الراحة مع باقة كبار الشخصيات للمطار. احجز توصيل مطار قياسي واحصل على ترقية مجانية إلى مرسيدس بنز الفئة-S الفاخرة لرحلة العودة.",
  },

  valid_until: { en: "Valid until", ar: "ساري حتى" },
  offer_inclusions: { en: "What's Included", ar: "ماذا يشمل العرض" },
  offer_terms: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
  offer_book_whatsapp: {
    en: "Book Offer via WhatsApp",
    ar: "احجز العرض عبر واتساب",
  },
  offer_price_label: { en: "Package Price", ar: "سعر الباقة" },
  offer_save: { en: "You Save", ar: "أنت توفر" },
  offer_details: { en: "Offer Details", ar: "تفاصيل العرض" },
  offer_highlights: { en: "Offer Highlights", ar: "أبرز مميزات العرض" },
  offer_more: { en: "More Exclusive Offers", ar: "المزيد من العروض الحصرية" },
  offer_instant: {
    en: "Instant confirmation • No hidden fees",
    ar: "تأكيد فوري • لا رسوم خفية",
  },

  incl_3days: { en: "3 Days Rental", ar: "إيجار 3 أيام" },
  incl_insurance: { en: "Full Insurance", ar: "تأمين شامل" },
  incl_mileage: { en: "200km/day Mileage", ar: "200 كم/يوم" },
  incl_delivery: { en: "Free Delivery in Dubai", ar: "توصيل مجاني في دبي" },
  incl_pickup: { en: "Airport Pickup & Drop-off", ar: "استقبال وتوصيل المطار" },
  incl_meet: { en: "Meet & Greet Service", ar: "خدمة الاستقبال والترحيب" },
  incl_assist: { en: "Luggage Assistance", ar: "مساعدة في الحقائب" },
  incl_upgrade: {
    en: "Free S-Class Upgrade",
    ar: "ترقية مجانية لمرسيدس S-Class",
  },

  term_age: { en: "Minimum age 25", ar: "الحد الأدنى للعمر 25" },
  term_license: {
    en: "Valid UAE Driving License",
    ar: "رخصة قيادة إماراتية سارية",
  },
  term_deposit: {
    en: "Credit Card required for deposit",
    ar: "بطاقة ائتمان مطلوبة للتأمين",
  },
  term_advance: { en: "Book 24h in advance", ar: "الحجز قبل 24 ساعة" },
  term_flight: { en: "Flight details required", ar: "بيانات الرحلة مطلوبة" },

  // Testimonials
  testimonials_title: {
    en: "Client Experiences",
    ar: "تجارب العملاء",
  },

  testimonial_1: {
    en: "Booking a car through Rahilty Almasiya was quick and seamless. The vehicle was clean and ready on time.",
    ar: "كانت عملية حجز السيارة عبر رحلتي الماسية سريعة وسهلة. السيارة كانت نظيفة وجاهزة في الوقت المحدد.",
  },

  testimonial_2: {
    en: "Excellent customer service. The car options were diverse, and the pricing was very reasonable for the Saudi market.",
    ar: "خدمة عملاء ممتازة. خيارات السيارات كانت متنوعة، والأسعار مناسبة جداً للسوق السعودي.",
  },

  testimonial_3: {
    en: "I rely on Rahilty Almasiya for my business trips. The platform is reliable, and the cars are always in top condition.",
    ar: "أعتمد على رحلتي الماسية في رحلاتي العملية. المنصة موثوقة والسيارات دائماً بحالة ممتازة.",
  },

  // // Blog General
  blog_title: { en: "Latest Articles", ar: "أحدث المقالات" },
  blog_subtitle: {
    en: "News and updates from the world of luxury.",
    ar: "أخبار وتحديثات من عالم الرفاهية.",
  },
  blog_read_more: { en: "Read Article", ar: "اقرأ المقال" },
  blog_search_placeholder: {
    en: "Search articles...",
    ar: "ابحث في المقالات...",
  },
  blog_back: { en: "Back to Articles", ar: "العودة للمقالات" },
  blog_not_found: { en: "Article not found", ar: "المقال غير موجود" },
  blog_no_results: {
    en: "No articles found matching your criteria.",
    ar: "لم يتم العثور على مقالات مطابقة لبحثك.",
  },
  blog_clear_filters: { en: "Clear Filters", ar: "مسح التصنيفات" },

  // Blog Categories
  cat_all: { en: "All", ar: "الكل" },
  cat_cars: { en: "Cars", ar: "سيارات" },
  cat_chauffeur: { en: "Chauffeur Service", ar: "خدمة السائق" },
  cat_tips: { en: "Travel Tips", ar: "نصائح السفر" },
  cat_vip: { en: "VIP Transport", ar: "نقل كبار الشخصيات" },

  // cat_news: { en: "News", ar: "أخبار" },
  // cat_offers: { en: "Offers", ar: "عروض" },

  // // Blog Content Keys
  // blog_content_intro_1: {
  //   en: "Dubai is a city best explored in style. From the towering Burj Khalifa to the pristine beaches of Jumeirah, every corner of this metropolis exudes luxury.",
  //   ar: "دبي مدينة من الأفضل استكشافها بأناقة. من برج خليفة الشاهق إلى شواطئ جميرا البكر، كل زاوية في هذه المدينة تنضح بالفخامة.",
  // },
  // blog_content_h2_1: {
  //   en: "Why Choose Luxury Transport?",
  //   ar: "لماذا تختار النقل الفاخر؟",
  // },
  // blog_content_p_1: {
  //   en: "Opting for a luxury chauffeur service ensures that you arrive at your destination refreshed and ready. Avoid the stress of navigation and parking while enjoying the comfort of a high-end vehicle.",
  //   ar: "يضمن اختيار خدمة السائق الفاخرة وصولك إلى وجهتك منتعشاً ومستعداً. تجنب عناء الملاحة ومواقف السيارات بينما تستمتع براحة سيارة راقية.",
  // },
  // blog_content_quote_1: {
  //   en: "Travel is the only thing you buy that makes you richer.",
  //   ar: "السفر هو الشيء الوحيد الذي تشتريه ويجعلك أكثر ثراءً.",
  // },
  // blog_list_item_1: {
  //   en: "Priority access to events",
  //   ar: "أولوية الوصول إلى الفعاليات",
  // },
  // blog_list_item_2: {
  //   en: "Professional multilingual chauffeurs",
  //   ar: "سائقون محترفون متعددو اللغات",
  // },
  // blog_list_item_3: {
  //   en: "Complementary Wi-Fi and refreshments",
  //   ar: "واي فاي ومرطبات مجانية",
  // },

  // // Blog Post Titles & Excerpts
  // blog_1_title: {
  //   en: "Top 5 Luxury Destinations in UAE",
  //   ar: "أفضل 5 وجهات فاخرة في الإمارات",
  // },
  // blog_1_excerpt: {
  //   en: "Discover the hidden gems of the UAE in style, from private desert retreats to urban sanctuaries.",
  //   ar: "اكتشف الجواهر الخفية في الإمارات بأناقة، من المنتجعات الصحراوية الخاصة إلى الملاذات الحضرية.",
  // },
  // blog_2_title: {
  //   en: "The New S-Class 2024: A Review",
  //   ar: "مراجعة مرسيدس إس كلاس 2024",
  // },
  // blog_2_excerpt: {
  //   en: "A comprehensive look inside the most advanced luxury sedan available in our fleet today.",
  //   ar: "نظرة شاملة داخل سيارة السيدان الفاخرة الأكثر تقدمًا المتوفرة في أسطولنا اليوم.",
  // },
  // blog_3_title: {
  //   en: "Chauffeur Etiquette 101",
  //   ar: "أساسيات إتيكيت السائق الخاص",
  // },
  // blog_3_excerpt: {
  //   en: "What makes our drivers stand out? It is all about the subtle art of service and discretion.",
  //   ar: "ما الذي يجعل سائقينا متميزين؟ الأمر كله يتعلق بالفن الدقيق للخدمة والسرية.",
  // },
  // blog_4_title: {
  //   en: "Experience the Formula 1 in Style",
  //   ar: "عيش تجربة الفورمولا 1 بأسلوب راقٍ",
  // },
  // blog_4_excerpt: {
  //   en: "Arrive at the Yas Marina Circuit in ultimate luxury. Beat the traffic and make an entrance.",
  //   ar: "وصل إلى حلبة مرسى ياس بقمة الفخامة. تجنب الازدحام وادخل بأسلوب مميز.",
  // },
  // blog_5_title: { en: "Business Travel Essentials", ar: "أساسيات سفر الأعمال" },
  // blog_5_excerpt: {
  //   en: "How to maintain productivity while on the move in Dubai. Tips for the modern executive.",
  //   ar: "كيف تحافظ على الإنتاجية أثناء التنقل في دبي. نصائح للمدير التنفيذي الحديث.",
  // },
  // blog_6_title: {
  //   en: "Wedding Cars: Making the Right Choice",
  //   ar: "سيارات الزفاف: اتخاذ القرار الصحيح",
  // },
  // blog_6_excerpt: {
  //   en: "From classic Rolls Royces to modern stretch limos, find the perfect match for your special day.",
  //   ar: "من رولز رويس الكلاسيكية إلى الليموزين العصرية، اعثر على السيارة المثالية ليومك الخاص.",
  // },

  // Blog General
  //مقال جدة — Jeddah
  blog_sa_jeddah_title: {
    en: "Premium Private Transport in Jeddah: Comfort and Seamless Mobility",
    ar: "أفضل خدمات النقل الخاص في جدة: رفاهية وسلاسة في الحركة",
  },

  blog_sa_jeddah_excerpt: {
    en: "Discover how My Diamond Journey delivers exceptional private transport services across Jeddah.",
    ar: "تعرف على كيف تقدم رحلتي الماسية خدمات نقل خاصة متميزة في جدة.",
  },
  blog_sa_jeddah_intro: {
    en: "As the gateway to the holy cities and one of Saudi Arabia’s most dynamic destinations, Jeddah welcomes millions of visitors annually. My Diamond Journey ensures every guest enjoys a smooth, luxurious, and stress-free travel experience.",
    ar: "باعتبارها بوابة الحرمين وإحدى أكثر مدن المملكة نشاطاً، تستقبل جدة ملايين الزوار سنوياً. وتضمن رحلتي الماسية أن يحظى كل ضيف بتجربة تنقل فاخرة وسلسة وخالية من الإجهاد.",
  },

  blog_sa_jeddah_h2_services: {
    en: "Our Services in Jeddah",
    ar: "خدماتنا في جدة",
  },

  blog_sa_jeddah_p_services: {
    en: "We provide tailored transport solutions for business travelers, families, and international guests with a wide range of luxury vehicles and professional chauffeurs.",
    ar: "نقدم حلول تنقل مصممة خصيصاً لرجال الأعمال والعائلات والضيوف الدوليين، مع مجموعة واسعة من المركبات الفاخرة والسائقين المحترفين.",
  },

  blog_sa_jeddah_list_item_airport: {
    en: "Airport pickup with premium Meet & Greet service",
    ar: "استقبال المطار مع خدمة الاستقبال الخاصة (Meet & Greet)",
  },

  blog_sa_jeddah_list_item_city: {
    en: "Hourly or full-day transport within the city",
    ar: "تنقلات داخل المدينة بالساعة أو اليوم الكامل",
  },

  blog_sa_jeddah_list_item_business: {
    en: "Business and delegation transport solutions",
    ar: "حلول نقل لرجال الأعمال والوفود",
  },

  blog_sa_jeddah_quote: {
    en: "Your journey in Jeddah is more than transportation — it is the beginning of a refined experience.",
    ar: "رحلتك في جدة ليست مجرد انتقال — إنها بداية لتجربة راقية.",
  },

  blog_sa_jeddah_p_end: {
    en: "With My Diamond Journey, mobility becomes an effortless extension of your lifestyle.",
    ar: "مع رحلتي الماسية، تصبح الحركة امتداداً سلساً لأسلوب حياتك.",
  },

  //مقال مكة — Makkah
  blog_sa_makkah_title: {
    en: "Private Transport in Makkah: Comfort and Ease for Visitors and Pilgrims",
    ar: "تنقلات مكة المكرمة: راحة وسهولة للزوار والحجاج",
  },
  blog_sa_makkah_excerpt: {
    en: "Discover how My Diamond Journey provides secure and organized transport in Makkah.",
    ar: "اكتشف كيف توفر رحلتي الماسية خدمات نقل آمنة ومنظمة في مكة المكرمة.",
  },
  blog_sa_makkah_intro: {
    en: "Visiting Makkah is a deeply spiritual journey. We ensure every guest experiences comfortable, reliable, and well-organized transport during their stay.",
    ar: "زيارة مكة المكرمة تجربة روحانية عميقة. ونضمن لكل ضيف تجربة نقل مريحة وموثوقة ومنظمة خلال زيارتهم.",
  },

  blog_sa_makkah_h2_experience: {
    en: "Why Choose My Diamond Journey in Makkah?",
    ar: "لماذا رحلتي الماسية هي الخيار الأفضل في مكة؟",
  },

  blog_sa_makkah_p_experience: {
    en: "We prioritize your comfort and time, offering services that support pilgrims and visitors while ensuring a smooth and dignified experience.",
    ar: "نضع راحتك ووقتك في مقدمة أولوياتنا، مع خدمات تدعم الحجاج والزوار وتضمن لهم تجربة سلسة ومحترمة.",
  },

  blog_sa_makkah_list_item_meet: {
    en: "Dedicated Meet & Greet upon arrival",
    ar: "استقبال خاص عند الوصول",
  },

  blog_sa_makkah_list_item_luggage: {
    en: "Full luggage assistance at all pickup points",
    ar: "مساعدة كاملة في الأمتعة في جميع نقاط الاستقبال",
  },

  blog_sa_makkah_list_item_driver: {
    en: "Professional chauffeurs experienced with Makkah routes",
    ar: "سائقون محترفون بخبرة في طرق مكة",
  },

  blog_sa_makkah_p_end: {
    en: "With our premium fleet and experienced team, we elevate every moment of your visit to the holy city.",
    ar: "مع أسطولنا الفاخر وفريقنا الخبير، نرتقي بكل لحظة خلال زيارتك للمدينة المقدسة.",
  },
  //مقال المدينة — Madinah
  blog_sa_madinah_title: {
    en: "Transport in Madinah: Safe and Comfortable Travel for Visitors",
    ar: "التنقل في المدينة المنورة: راحة وسلامة للمسافرين",
  },
  blog_sa_madinah_excerpt: {
    en: "Enjoy safe, smooth, and comfortable travel with professional drivers across Madinah.",
    ar: "استمتع برحلات آمنة ومريحة مع سائقين محترفين داخل المدينة المنورة.",
  },
  blog_sa_madinah_intro: {
    en: "Madinah’s calm atmosphere makes transportation an essential part of a peaceful visit. We ensure your journeys are smooth and worry-free.",
    ar: "يضيف الهدوء الذي يميز المدينة المنورة أهمية خاصة لتجربة التنقل. نضمن أن تكون رحلاتك سلسة وخالية من القلق.",
  },

  blog_sa_madinah_h2_safety: {
    en: "Safety and Comfort in Every Trip",
    ar: "أمان وراحة في كل رحلة",
  },

  blog_sa_madinah_p_safety: {
    en: "My Diamond Journey adheres to the highest safety standards, whether for short city transfers or long-distance travel.",
    ar: "تلتزم رحلتي الماسية بأعلى معايير السلامة، سواء في التنقلات القصيرة داخل المدينة أو الرحلات الطويلة بين المناطق.",
  },

  blog_sa_madinah_list_item_comfort: {
    en: "Modern vehicles designed for maximum comfort",
    ar: "مركبات حديثة مصممة لأقصى درجات الراحة",
  },

  blog_sa_madinah_list_item_punctuality: {
    en: "Strict punctuality for all reservations",
    ar: "التزام صارم بالمواعيد لجميع الحجوزات",
  },

  blog_sa_madinah_list_item_pro_drivers: {
    en: "Expert chauffeurs trained in customer care",
    ar: "سائقون محترفون مدربون على خدمة العملاء",
  },

  blog_sa_madinah_p_end: {
    en: "Your comfort in Madinah is our priority, ensuring that every trip reflects the peaceful nature of the city.",
    ar: "راحتك في المدينة المنورة هي أولويتنا، لنضمن أن تعكس كل رحلة سكينة المكان.",
  },

  //مقال VIP — كبار الشخصيات
  blog_sa_vip_title: {
    en: "VIP Transport Experience: Luxury Tailored for Distinguished Guests",
    ar: "تجربة نقل كبار الشخصيات: فخامة مصممة للضيوف المميزين",
  },
  blog_sa_vip_excerpt: {
    en: "Discover a premium world of exclusive services, luxury vehicles, and professional chauffeurs.",
    ar: "اكتشف عالماً من الخدمات الحصرية، السيارات الفاخرة، والسائقين المحترفين.",
  },
  blog_sa_vip_intro: {
    en: "Whether it is a major business meeting or a high-profile event, the right transport service shapes the first impression. Our VIP service blends privacy, luxury, and impeccable hospitality.",
    ar: "سواء كان اجتماع عمل مهم أو مناسبة رفيعة المستوى، فإن اختيار خدمة النقل المناسبة يصنع الانطباع الأول. تجمع خدمة VIP لدينا بين الخصوصية والفخامة وحسن الضيافة.",
  },

  blog_sa_vip_h2_features: {
    en: "What Makes Our VIP Service Unique?",
    ar: "ما الذي يميز خدمة كبار الشخصيات لدينا؟",
  },

  blog_sa_vip_p_features: {
    en: "We provide an integrated suite of premium services tailored for VIP guests, ensuring exceptional comfort and seamless coordination.",
    ar: "نقدم مجموعة متكاملة من الخدمات الفاخرة المصممة خصيصاً لضيوف كبار الشخصيات، لضمان راحة استثنائية وتنسيق سلس.",
  },

  blog_sa_vip_list_item_fleet: {
    en: "A luxury fleet including Mercedes, BMW, and Lexus",
    ar: "أسطول فاخر يشمل مرسيدس وبي إم دبليو ولكزس",
  },

  blog_sa_vip_list_item_concierge: {
    en: "Dedicated concierge service to coordinate your schedule",
    ar: "كونسييرج مخصص لتنسيق مواعيدك واحتياجاتك",
  },

  blog_sa_vip_list_item_events: {
    en: "VIP transfers for conferences, events, and red-carpet occasions",
    ar: "تنقلات كبار الشخصيات للمؤتمرات والفعاليات والمناسبات الرسمية",
  },

  blog_sa_vip_p_end: {
    en: "With My Diamond Journey, luxury is not an upgrade — it is the standard.",
    ar: "مع رحلتي الماسية، الفخامة ليست ترقية — بل هي المعيار الأساسي.",
  },

  // Promos
  promo_1_title: { en: "Summer Special", ar: "عروض الصيف" },
  promo_1_sub: {
    en: "Special rates on weekly rentals",
    ar: "أسعار خاصة على الإيجارات الأسبوعية",
  },
  promo_2_title: { en: "Corporate Accounts", ar: "حسابات الشركات" },
  promo_2_sub: {
    en: "Priority booking and special rates",
    ar: "أولوية الحجز وأسعار خاصة",
  },

  // Booking Form & Contact
  booking_title: { en: "Request Booking", ar: "طلب الحجز" },
  booking_summary: { en: "Request Summary", ar: "ملخص الطلب" },
  booking_select: { en: "Please select a vehicle", ar: "يرجى اختيار سيارة" },
  booking_base_rate: { en: "Rate", ar: "السعر" },
  booking_chauffeur: { en: "Chauffeur", ar: "السائق" },
  booking_fuel: { en: "Fuel", ar: "الوقود" },
  booking_included: { en: "Included", ar: "مشمول" },

  booking_contact_rates: {
    en: "Contact for Rates",
    ar: "تواصل لمعرفة الأسعار",
  },

  contact_title: { en: "Get In Touch", ar: "تواصل معنا" },
  contact_subtitle: {
    en: "We are here to assist you 24/7",
    ar: "نحن هنا لمساعدتك على مدار الساعة",
  },
  contact_form_title: { en: "Send us a request", ar: "أرسل لنا طلباً" },
  // contact_phone label removed to avoid conflict with value
  // contact_email label removed to avoid conflict with value
  contact_location: { en: "Location", ar: "الموقع" },
  contact_hours_label: { en: "Hours", ar: "ساعات العمل" },

  label_name: { en: "Full Name", ar: "الاسم الكامل" },
  label_phone: { en: "Phone Number", ar: "رقم الهاتف" },
  label_email: { en: "Email Address", ar: "البريد الإلكتروني" },
  label_message: { en: "Your Message", ar: "رسالتك" },
  label_pickup: { en: "Pickup Location", ar: "موقع الاستلام" },
  label_dropoff: { en: "Drop-off Location", ar: "وجهة الوصول" },
  label_date: { en: "Date", ar: "التاريخ" },
  label_time: { en: "Time", ar: "الوقت" },
  label_car: { en: "Select Vehicle", ar: "اختر السيارة" },
  btn_submit: { en: "Request via WhatsApp", ar: "اطلب عبر واتساب" },
  btn_send: { en: "Send via WhatsApp", ar: "أرسل عبر واتساب" },
  btn_book_whatsapp: { en: "Book via WhatsApp", ar: "احجز عبر واتساب" },
  btn_read_more: { en: "Read More", ar: "اقرأ المزيد" },
  btn_view_details: { en: "View Details", ar: "عرض التفاصيل" },
  btn_subscribe: { en: "Subscribe", ar: "اشتراك" },

  // contact_address: {
  //   en: "Higaz Horizon Elevators Company, Al-Basalah, Al-Rusaifah, Mecca, Kingdom of Saudi Arabia",
  //   ar: "شركة حجاز هورايزن للمصاعد، حي البسالة، حي الرصيفة، مكة، المملكة العربية السعودية",
  // },
  contact_address: {
    en: "Makkah Al-Mukarramah, Al-Rusaifah District, Al-Basalah Street, Al-Salwa Tower, 6th Floor, Office 6",
    ar: "مكة المكرمة، حي الرصيفة، شارع البسالة، برج السلوى، الدور السادس، مكتب ٦",
  },
  contact_map_link: {
    en: "https://maps.app.goo.gl/UWfiCCpC9Ln7no3F9?g_st=iw",
    ar: "https://maps.app.goo.gl/UWfiCCpC9Ln7no3F9?g_st=iw",
  },
  contact_phone: { en: "+966567546669", ar: "+966567546669" },
  contact_email: { en: "info@rahilatialmasiya.com", ar: "info@rahilatialmasiya.com" },
  contact_whatsapp: { en: "+966567546669", ar: "+966567546669" },
  contact_tourism_phone: { en: "+966500354478", ar: "+966500354478" },
  contact_tourism_email: { en: "hotels@rahilatialmasiya.com", ar: "hotels@rahilatialmasiya.com" },
  contact_tourism_whatsapp: { en: "966500354478", ar: "966500354478" },
  contact_verification_number: { en: "0000207056", ar: "٠٠٠٠٢٠٧٠٥٦" },
  contact_hours: {
    en: "Available 24 hours daily",
    ar: "متاحون يوميًا على مدار 24 ساعة",
  },
  // Footer
  footer_rights: { en: "All Rights Reserved", ar: "جميع الحقوق محفوظة" },
  footer_desc: {
    en: "Rahilaty Almasiya is the luxurious gateway that redefines private transportation and premium hospitality services. We were founded to balance the need for efficient transport with the desire for a travel experience marked by luxury, privacy, and absolute professionalism.",
    ar: "رحلتي الماسية بوابة العبور الفاخرة التي تعيد تعريف مفهوم النقل الخاص وخدمات الضيافة الراقية. تأسسنا لنوازن بين الاحتياج للنقل الفعال والرغبة في تجربة سفر تتميز بالفخامة، الخصوصية، والاحترافية المطلقة.",
  },
  footer_links: { en: "Quick Links", ar: "روابط سريعة" },
  footer_contact: { en: "Contact Info", ar: "معلومات الاتصال" },
  footer_newsletter: { en: "Newsletter", ar: "النشرة البريدية" },
  footer_vip: { en: "VIP Access", ar: "دخول كبار الشخصيات" },
  footer_vip_desc: {
    en: "Join our exclusive member list for special rates.",
    ar: "انضم لقائمتنا الحصرية للحصول على أسعار خاصة.",
  },
  footer_verification_number: { en: "Verification Number", ar: "رقم التوثيق" },
  footer_privacy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  footer_terms: { en: "Terms of Service", ar: "شروط الخدمة" },
};

export const BLOG_CATEGORIES = [
  "cat_all",
  "cat_cars",
  "cat_chauffeur",
  "cat_tips",
  "cat_vip",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    titleKey: "blog_sa_jeddah_title",
    excerptKey: "blog_sa_jeddah_excerpt",
    date: "Feb 02, 2025",
    image: "/assets/Jeddah.jpeg",
    category: "cat_tips",
    author: "Rahaf Al-Mutairi",
    readTime: "5 Min Read",
    content: [
      { type: "paragraph", valueKey: "blog_sa_jeddah_intro" },
      { type: "h2", valueKey: "blog_sa_jeddah_h2_services" },
      { type: "paragraph", valueKey: "blog_sa_jeddah_p_services" },
      {
        type: "list",
        itemsKeys: [
          "blog_sa_jeddah_list_item_airport",
          "blog_sa_jeddah_list_item_city",
          "blog_sa_jeddah_list_item_business",
        ],
      },
      // {
      //   type: "image",
      //   src: "/assets/Jeddah.jpeg",
      // },
      { type: "quote", valueKey: "blog_sa_jeddah_quote" },
      { type: "paragraph", valueKey: "blog_sa_jeddah_p_end" },
    ],
  },

  {
    id: "2",
    titleKey: "blog_sa_makkah_title",
    excerptKey: "blog_sa_makkah_excerpt",
    date: "Jan 20, 2025",
    image: "/assets/Makkah.jpeg",
    category: "cat_chauffeur",
    author: "Yousef Al-Harbi",
    readTime: "6 Min Read",
    content: [
      { type: "paragraph", valueKey: "blog_sa_makkah_intro" },
      { type: "image", src: "/assets/blog/makkah-road.jpeg" },
      { type: "h2", valueKey: "blog_sa_makkah_h2_experience" },
      { type: "paragraph", valueKey: "blog_sa_makkah_p_experience" },
      {
        type: "list",
        itemsKeys: [
          "blog_sa_makkah_list_item_meet",
          "blog_sa_makkah_list_item_luggage",
          "blog_sa_makkah_list_item_driver",
        ],
      },
      { type: "paragraph", valueKey: "blog_sa_makkah_p_end" },
    ],
  },

  {
    id: "3",
    titleKey: "blog_sa_madinah_title",
    excerptKey: "blog_sa_madinah_excerpt",
    date: "Jan 28, 2025",
    image: "/assets/Madina.jpeg",
    category: "cat_cars",
    author: "Noura Al-Johani",
    readTime: "4 Min Read",
    content: [
      { type: "paragraph", valueKey: "blog_sa_madinah_intro" },
      { type: "h2", valueKey: "blog_sa_madinah_h2_safety" },
      { type: "paragraph", valueKey: "blog_sa_madinah_p_safety" },
      {
        type: "list",
        itemsKeys: [
          "blog_sa_madinah_list_item_comfort",
          "blog_sa_madinah_list_item_punctuality",
          "blog_sa_madinah_list_item_pro_drivers",
        ],
      },
      { type: "paragraph", valueKey: "blog_sa_madinah_p_end" },
    ],
  },

  {
    id: "4",
    titleKey: "blog_sa_vip_title",
    excerptKey: "blog_sa_vip_excerpt",
    date: "Feb 05, 2025",
    image: "/assets/Mercedes.png",
    category: "cat_vip",
    author: "Lina Al-Suwailem",
    readTime: "7 Min Read",
    content: [
      { type: "paragraph", valueKey: "blog_sa_vip_intro" },
      { type: "h2", valueKey: "blog_sa_vip_h2_features" },
      { type: "paragraph", valueKey: "blog_sa_vip_p_features" },
      {
        type: "list",
        itemsKeys: [
          "blog_sa_vip_list_item_fleet",
          "blog_sa_vip_list_item_concierge",
          "blog_sa_vip_list_item_events",
        ],
      },
      // { type: "image", src: "/assets/blog/vip-cars.jpeg" },
      { type: "paragraph", valueKey: "blog_sa_vip_p_end" },
    ],
  },
];

export const OFFERS: Offer[] = [
  {
    id: "1",
    titleKey: "offer_weekend_title",
    descKey: "offer_weekend_desc",
    fullDescKey: "offer_weekend_full",
    discount: "Special Rate",
    image: "/assets/offer1.avif",
    // تم التحديث من 2023 → 2025
    validUntil: "Dec 31, 2025",
    category: "SUV",
    inclusions: [
      "incl_3days",
      "incl_insurance",
      "incl_mileage",
      "incl_delivery",
    ],
    terms: ["term_age", "term_license", "term_deposit"],
    gallery: ["/assets/offer1.avif", "/assets/Bus (Standard).png"],
  },
  {
    id: "2",
    titleKey: "offer_airport_title",
    descKey: "offer_airport_desc",
    fullDescKey: "offer_airport_full",
    discount: "Free Upgrade",
    image: "/assets/Luxus.png",
    // تم التحديث من 2024 → 2025
    validUntil: "Jan 31, 2025",
    category: "VIP",
    inclusions: ["incl_pickup", "incl_meet", "incl_assist", "incl_upgrade"],
    terms: ["term_advance", "term_flight"],
    gallery: ["/assets/Luxus.png", "/assets/Camry.png"],
  },
];

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "1",
    titleKey: "promo_banner_title",
    subtitleKey: "promo_banner_subtitle",
    image: "/assets/work.jpeg",
    ctaKey: "nav_book",
  },
  {
    id: "2",
    titleKey: "campaign_title",
    subtitleKey: "campaign_subtitle",
    image: "/assets/GMC XL.png",
    ctaKey: "nav_contact",
  },
];

export const SERVICES: Service[] = [
  {
    id: "1",
    titleKey: "services_airport_title",
    descKey: "services_airport_desc",
    image: "/assets/Jeddah.jpeg",
    features: [
      "feat_flight_tracking",
      "feat_meet_greet",
      "feat_luggage",
      "feat_waiting",
    ],
    faqs: [
      { question: "faq_cost_q", answer: "faq_cost_a" },
      { question: "faq_payment_q", answer: "faq_payment_a" },
      { question: "faq_booking_q", answer: "faq_booking_a" },
      { question: "faq_childseat_q", answer: "faq_childseat_a" },
      { question: "faq_wait_q", answer: "faq_wait_a" },
      { question: "faq_languages_q", answer: "faq_languages_a" },
      { question: "faq_cancel_q", answer: "faq_cancel_a" },
      { question: "faq_disability_q", answer: "faq_disability_a" },
    ],
    gallery: ["/assets/Jeddah.jpeg"],
  },
  {
    id: "2",
    titleKey: "services_business_title",
    descKey: "services_business_desc",
    image: "/assets/Makkah.jpeg",
    features: [
      "feat_wifi",
      "feat_privacy",
      "feat_newspaper",
      "feat_refreshments",
    ],
    gallery: ["/assets/Makkah.jpeg"],
  },
  {
    id: "3",
    titleKey: "services_chauffeur_title",
    descKey: "services_chauffeur_desc",
    image: "/assets/Madina.jpeg",
    features: [
      "feat_uniform",
      "feat_multi_lang",
      "feat_security",
      "feat_discreet",
    ],
    gallery: ["/assets/Madina.jpeg", "/assets/Madina.jpeg"],
  },
  {
    id: "4",
    titleKey: "services_vip_title",
    descKey: "services_vip_desc",
    image: "/assets/Mercedes.png",
    features: [
      "feat_flexible",
      "feat_hourly",
      "feat_concierge",
      "feat_premium_fleet",
    ],
  },
  {
    id: "5",
    titleKey: "services_wedding_title",
    descKey: "services_wedding_desc",
    image: "/assets/Ford.png",
    features: [
      "feat_decoration",
      "feat_red_carpet",
      "feat_champagne",
      "feat_plate",
    ],
  },
  {
    id: "6",
    titleKey: "services_family_title",
    descKey: "services_family_desc",
    image: "/assets/Bus (Standard).png",
    features: [
      "feat_child_seats",
      "feat_space",
      "feat_entertainment",
      "feat_safe_driving",
    ],
  },
  {
    id: "7",
    titleKey: "services_exec_airport_title",
    descKey: "services_exec_airport_desc",
    image: "/assets/ExecutiveAirport.png",
    features: [
      "feat_priority_lane",
      "feat_lounge_access",
      "feat_greeting_escort",
      "feat_fast_track",
    ],
    gallery: ["/assets/ExecutiveAirport.png"],
  },

  {
    id: "8",
    titleKey: "services_hotel_booking_title",
    descKey: "services_hotel_booking_desc",
    image: "/assets/HotelBooking.png",
    features: [
      "feat_5star_hotels",
      "feat_special_rates",
      "feat_makkah_madinah",
      "feat_vip_handling",
    ],
    gallery: ["/assets/HotelBooking.png"],
  },
];
export const FLEET: Car[] = [
  {
    id: "1",
    name: { en: "Mercedes", ar: "مرسيدس" },
    category: "Luxury",
    image: "/assets/Mercedes.png",
    passengers: 3,
    luggage: 2,
    features: ["feat_massage", "feat_rear_ent", "feat_wifi", "feat_shades"],
    descriptionKey: "car_desc_s_class",
    specs: {
      engine: "V8 Biturbo",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "250 km/h",
    },
    gallery: ["/assets/Mercedes.png"],
  },
  {
    id: "2",
    name: { en: "BMW", ar: "بي إم دبليو" },
    category: "Luxury",
    image: "/assets/BMW.png",
    passengers: 3,
    luggage: 2,
    features: ["feat_gesture", "feat_lounge", "feat_sound", "feat_roof"],
    descriptionKey: "car_desc_bmw7",
    specs: {
      engine: "TwinPower Turbo",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "250 km/h",
    },
    gallery: ["/assets/BMW.png"],
  },
  {
    id: "3",
    name: { en: "Cadillac", ar: "كاديلاك" },
    category: "SUV",
    image: "/assets/Cadillac.png",
    passengers: 6,
    luggage: 5,
    features: ["feat_oled", "feat_sound", "feat_cruise", "feat_massive"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "6.2L V8",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "200 km/h",
    },
    gallery: ["/assets/Cadillac.png"],
  },
  {
    id: "4",
    name: { en: "Luxus", ar: "لكزس" },
    category: "Luxury",
    image: "/assets/Luxus.png",
    passengers: 4,
    luggage: 3,
    features: ["feat_lounge", "feat_sound", "feat_luxury", "feat_shades"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "V6 / Hybrid",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "240 km/h",
    },
    gallery: ["/assets/Luxus.png"],
  },
  {
    id: "5",
    name: { en: "Ford", ar: "فورد" },
    // تم تعديل الفئة من "Van" إلى "Sedan"
    category: "Sedan",
    image: "/assets/Ford.png",
    passengers: 4,
    luggage: 3,
    // ميزات مناسبة لسيدان (تم تبسيط بعض الميزات مقارنة بالـ Van)
    features: [
      "feat_comfort",
      "feat_space",
      "feat_safe_driving",
      "feat_cooler",
    ],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "2.0L Turbo",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "200 km/h",
    },
    gallery: ["/assets/Ford.png"],
  },
  {
    id: "6",
    name: { en: "Camry", ar: "كامري" },
    // تم تعديل الفئة من "Luxury" إلى "Economy"
    category: "Economy",
    image: "/assets/Camry.png",
    passengers: 4,
    luggage: 3,
    // ميزات مناسبة لفئة اقتصادية مريحة
    features: ["feat_comfort", "feat_rear_ent", "feat_wifi"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "2.5L Hybrid",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "210 km/h",
    },
    gallery: ["/assets/Camry.png"],
  },
  {
    id: "7",
    name: { en: "Staria", ar: "ستاريا" },
    category: "Van",
    image: "/assets/Staria.png",
    passengers: 8,
    luggage: 6,
    features: ["feat_space", "feat_entertainment", "feat_child_seats"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "2.2L Diesel",
      transmission: "val_auto",
      fuel: "val_diesel",
      speed: "180 km/h",
    },
    gallery: ["/assets/Staria.png"],
  },
  {
    id: "8",
    name: { en: "Bus (Standard)", ar: "حافلة (عادية)" },
    category: "Van",
    image: "/assets/Bus (Standard).png",
    passengers: 20,
    luggage: 20,
    features: ["feat_space", "feat_safe_driving"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "6.7L Diesel",
      transmission: "manual",
      fuel: "val_diesel",
      speed: "120 km/h",
    },
    gallery: ["/assets/Bus (Standard).png"],
  },
  {
    id: "9",
    name: { en: "Bus (Executive)", ar: "حافلة (تنفيذية)" },
    category: "Van",
    image: "/assets/Bus (Executive).png",
    passengers: 18,
    luggage: 18,
    features: ["feat_lounge", "feat_refreshments", "feat_wifi"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "6.7L Diesel",
      transmission: "manual",
      fuel: "val_diesel",
      speed: "120 km/h",
    },
    gallery: ["/assets/Bus (Executive).png"],
  },
  {
    id: "10",
    name: { en: "Chevrolet Suburban XL", ar: "شيفروليه سوبربان XL" },
    category: "SUV",
    image: "/assets/Chevrolet Suburban XL.png",
    passengers: 7,
    luggage: 6,
    features: ["feat_massive", "feat_sound", "feat_offroad"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "5.3L V8",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "190 km/h",
    },
    gallery: ["/assets/Chevrolet Suburban XL.png"],
  },
  {
    id: "11",
    name: { en: "GMC XL", ar: "جي إم سي XL" },
    category: "SUV",
    image: "/assets/GMC XL.png",
    passengers: 7,
    luggage: 6,
    features: ["feat_massive", "feat_oled", "feat_cruise"],
    descriptionKey: "car_desc_generic",
    specs: {
      engine: "6.2L V8",
      transmission: "val_auto",
      fuel: "val_petrol",
      speed: "190 km/h",
    },
    gallery: ["/assets/GMC XL.png"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "عبدالله السلمان",
    role: "رجل أعمال",
    commentKey: "testimonial_1",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    name: "نورة العتيبي",
    role: "منسقة فعاليات",
    commentKey: "testimonial_2",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    name: "فيصل الدخيل",
    role: "مدير مشاريع",
    commentKey: "testimonial_3",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  },
];

export const COMPANY_STATS = [
  { id: "1", value: "1K+", labelKey: "stat_partners" },
  { id: "2", value: "5+", labelKey: "stat_years" },
  { id: "3", value: "30+", labelKey: "stat_staff" },
  { id: "4", value: "50+", labelKey: "stat_trips" },
];

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Mohammed Al-Rahil",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    role: "Operations Manager",
    image:
      "https://images.unsplash.com/photo-1573496359-136d475583dc?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Karim Hassan",
    role: "Head Chauffeur",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
  },
];

export const PARTNERS = [
  {
    id: 1,
    name: "Emirates",
    logo: "/assets/partner/Emirates_logo.svg",
  },
  {
    id: 2,
    name: "Jumeirah",
    logo: "/assets/partner/jumeirah.jpg",
  },
  {
    id: 3,
    name: "Emaar",
    logo: "/assets/partner/EMAAR.webp",
  },
  {
    id: 4,
    name: "Atlantis",
    logo: "/assets/partner/palm-dubai.png",
  },
  {
    id: 5,
    name: "Dubai Airports",
    logo: "/assets/partner/air.jpg",
  },
  {
    id: 6,
    name: "Ritz-Carlton",
    logo: "/assets/partner/Ritz-Carlton.png",
  },
];
