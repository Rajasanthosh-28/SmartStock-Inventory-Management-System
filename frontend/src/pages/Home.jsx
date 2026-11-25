import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Boxes,
  ShoppingCart,
  Truck,
  BarChart3,
  Bell,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Package,
  TrendingUp,
  Activity,
  Users,
  Globe,
  Zap,
  Moon,
  Sun,
  Monitor,
  Warehouse,
  ClipboardList,
  ChartNoAxesCombined,
} from "lucide-react";

import { useTranslation } from "../context/TranslationContext";
import "./Home.css";


const content = {
  en: {
    nav: {
      home: "Home",
      features: "Features",
      workflow: "How It Works",
      about: "About",
      login: "Login",
      getStarted: "Get Started",
    },

    hero: {
      badge: "SMART INVENTORY MANAGEMENT",
      title: "Manage Your Business",
      highlight: "Smarter & Faster",
      description:
        "Take control of your inventory, sales, purchases, and business operations with one powerful and easy-to-use management platform.",
      primaryButton: "Get Started",
      secondaryButton: "Explore Features",
      trusted: "A smarter way to manage your business",
    },

    dashboard: {
      overview: "OVERVIEW",
      title: "Inventory Dashboard",
      live: "LIVE",
      totalProducts: "Total Products",
      totalSales: "Total Sales",
      lowStock: "Low Stock Items",
      revenue: "Total Revenue",
      stockActivity: "Stock Activity",
      recentActivity: "Recent Activity",
      stockUpdated: "Stock Updated",
      newSale: "New Sale Completed",
      purchaseAdded: "Purchase Added",
      growth: "Growth",
      thisMonth: "This Month",
    },

    features: {
      label: "SMART FEATURES",
      title: "Everything Your Business Needs",
      description:
        "Manage all your important business activities from one simple and organized platform.",

      inventory: "Inventory Management",
      inventoryDesc:
        "Manage products, monitor stock levels, and keep your inventory organized.",

      sales: "Sales Management",
      salesDesc:
        "Track sales transactions, monitor revenue, and manage customer orders.",

      purchases: "Purchase Management",
      purchasesDesc:
        "Manage purchase orders, supplier details, and incoming stock.",

      suppliers: "Supplier Management",
      suppliersDesc:
        "Organize supplier information and maintain better business relationships.",

      analytics: "Reports & Analytics",
      analyticsDesc:
        "Understand business performance through reports, charts, and insights.",

      security: "Secure Access",
      securityDesc:
        "Protect business information with role-based access and secure authentication.",
    },

    workflow: {
      label: "SIMPLE WORKFLOW",
      title: "Manage Your Business in Three Steps",
      description:
        "A simple process that helps you organize your daily business operations.",

      step1: "Add Your Products",
      step1Desc:
        "Add products, categories, pricing, and stock information to your inventory.",

      step2: "Manage Operations",
      step2Desc:
        "Handle sales, purchases, suppliers, and stock movements in one place.",

      step3: "Track Performance",
      step3Desc:
        "View reports, monitor business activities, and make better decisions.",
    },

    benefits: {
      label: "WHY SMARTSTOCK",
      title: "Designed for Smarter Inventory Management",
      description:
        "Simplify everyday business operations and get a clearer view of your business.",

      benefit1: "Easy-to-use dashboard",
      benefit2: "Organized inventory management",
      benefit3: "Real-time stock monitoring",
      benefit4: "Business reports and analytics",
      benefit5: "Centralized business information",
      benefit6: "Secure user authentication",

      cardTitle: "Your Business. One Platform.",
      cardDescription:
        "Bring your inventory and business operations together.",
    },

    cta: {
      title: "Smarter Business Starts Here",
      description:
        "Take the next step towards organized and efficient business management.",
      button: "Get Started Now",
    },

    footer: {
      description:
        "A smart and simple platform for managing inventory and business operations.",
      quickLinks: "Quick Links",
      resources: "Features",
      contact: "Get Started",
      rights: "All rights reserved.",
      home: "Home",
      features: "Features",
      workflow: "How It Works",
      login: "Login",
    },

    theme: {
      light: "Light Mode",
      dark: "Dark Mode",
      night: "Night Mode",
      change: "Change Theme",
    },
  },

  ta: {
    nav: {
      home: "முகப்பு",
      features: "அம்சங்கள்",
      workflow: "செயல்முறை",
      about: "எங்களை பற்றி",
      login: "உள்நுழை",
      getStarted: "தொடங்குங்கள்",
    },

    hero: {
      badge: "ஸ்மார்ட் சரக்கு மேலாண்மை",
      title: "உங்கள் வணிகத்தை",
      highlight: "சிறப்பாகவும் வேகமாகவும் நிர்வகிக்கவும்",
      description:
        "ஒரே எளிய தளத்தின் மூலம் உங்கள் சரக்கு, விற்பனை, கொள்முதல் மற்றும் வணிக செயல்பாடுகளை நிர்வகிக்கவும்.",
      primaryButton: "தொடங்குங்கள்",
      secondaryButton: "அம்சங்களை பார்க்கவும்",
      trusted: "உங்கள் வணிகத்தை நிர்வகிக்கும் சிறந்த வழி",
    },

    dashboard: {
      overview: "மேலோட்டம்",
      title: "சரக்கு டாஷ்போர்டு",
      live: "நேரலை",
      totalProducts: "மொத்த பொருட்கள்",
      totalSales: "மொத்த விற்பனை",
      lowStock: "குறைந்த சரக்கு",
      revenue: "மொத்த வருமானம்",
      stockActivity: "சரக்கு செயல்பாடு",
      recentActivity: "சமீபத்திய செயல்பாடுகள்",
      stockUpdated: "சரக்கு புதுப்பிக்கப்பட்டது",
      newSale: "புதிய விற்பனை முடிந்தது",
      purchaseAdded: "கொள்முதல் சேர்க்கப்பட்டது",
      growth: "வளர்ச்சி",
      thisMonth: "இந்த மாதம்",
    },

    features: {
      label: "சிறப்பு அம்சங்கள்",
      title: "உங்கள் வணிகத்திற்கு தேவையான அனைத்தும்",
      description:
        "உங்கள் முக்கியமான வணிக செயல்பாடுகளை ஒரே எளிய தளத்தில் நிர்வகிக்கவும்.",

      inventory: "சரக்கு மேலாண்மை",
      inventoryDesc:
        "பொருட்களை நிர்வகிக்கவும், சரக்கு அளவைக் கண்காணிக்கவும்.",

      sales: "விற்பனை மேலாண்மை",
      salesDesc:
        "விற்பனை பரிவர்த்தனைகள் மற்றும் வருமானத்தை கண்காணிக்கவும்.",

      purchases: "கொள்முதல் மேலாண்மை",
      purchasesDesc:
        "கொள்முதல் ஆர்டர்கள் மற்றும் வரவிருக்கும் சரக்குகளை நிர்வகிக்கவும்.",

      suppliers: "வழங்குநர் மேலாண்மை",
      suppliersDesc:
        "வழங்குநர் தகவல்களை ஒழுங்குபடுத்தி வணிக உறவுகளை மேம்படுத்தவும்.",

      analytics: "அறிக்கைகள் மற்றும் பகுப்பாய்வு",
      analyticsDesc:
        "அறிக்கைகள் மற்றும் வரைபடங்கள் மூலம் வணிக செயல்திறனை அறியவும்.",

      security: "பாதுகாப்பான அணுகல்",
      securityDesc:
        "பாதுகாப்பான அங்கீகாரம் மூலம் வணிகத் தகவல்களைப் பாதுகாக்கவும்.",
    },

    workflow: {
      label: "எளிய செயல்முறை",
      title: "மூன்று படிகளில் உங்கள் வணிகத்தை நிர்வகிக்கவும்",
      description:
        "உங்கள் தினசரி வணிக செயல்பாடுகளை ஒழுங்குபடுத்தும் எளிய செயல்முறை.",

      step1: "பொருட்களை சேர்க்கவும்",
      step1Desc:
        "பொருட்கள், வகைகள், விலைகள் மற்றும் சரக்கு விவரங்களை சேர்க்கவும்.",

      step2: "செயல்பாடுகளை நிர்வகிக்கவும்",
      step2Desc:
        "விற்பனை, கொள்முதல் மற்றும் வழங்குநர்களை ஒரே இடத்தில் நிர்வகிக்கவும்.",

      step3: "செயல்திறனை கண்காணிக்கவும்",
      step3Desc:
        "அறிக்கைகளைப் பார்த்து வணிக செயல்பாடுகளை கண்காணிக்கவும்.",
    },

    benefits: {
      label: "ஏன் SMARTSTOCK",
      title: "சிறந்த சரக்கு மேலாண்மைக்காக உருவாக்கப்பட்டது",
      description:
        "தினசரி வணிக செயல்பாடுகளை எளிமையாக்கி உங்கள் வணிகத்தை தெளிவாக நிர்வகிக்கவும்.",

      benefit1: "பயன்படுத்த எளிய டாஷ்போர்டு",
      benefit2: "ஒழுங்கான சரக்கு மேலாண்மை",
      benefit3: "நேரடி சரக்கு கண்காணிப்பு",
      benefit4: "வணிக அறிக்கைகள் மற்றும் பகுப்பாய்வு",
      benefit5: "மையப்படுத்தப்பட்ட வணிகத் தகவல்கள்",
      benefit6: "பாதுகாப்பான பயனர் அங்கீகாரம்",

      cardTitle: "உங்கள் வணிகம். ஒரே தளம்.",
      cardDescription:
        "உங்கள் சரக்கு மற்றும் வணிக செயல்பாடுகளை ஒரே இடத்தில் இணைக்கவும்.",
    },

    cta: {
      title: "சிறந்த வணிக மேலாண்மை இங்கே தொடங்குகிறது",
      description:
        "ஒழுங்கான மற்றும் திறமையான வணிக மேலாண்மையை நோக்கி அடுத்த படியை எடுங்கள்.",
      button: "இப்போதே தொடங்குங்கள்",
    },

    footer: {
      description:
        "சரக்கு மற்றும் வணிக செயல்பாடுகளை நிர்வகிப்பதற்கான எளிய தளம்.",
      quickLinks: "விரைவு இணைப்புகள்",
      resources: "அம்சங்கள்",
      contact: "தொடங்குங்கள்",
      rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      home: "முகப்பு",
      features: "அம்சங்கள்",
      workflow: "செயல்முறை",
      login: "உள்நுழை",
    },

    theme: {
      light: "ஒளி பயன்முறை",
      dark: "இருள் பயன்முறை",
      night: "இரவு பயன்முறை",
      change: "தீமை மாற்றவும்",
    },
  },

  hi: {
    nav: {
      home: "होम",
      features: "विशेषताएँ",
      workflow: "यह कैसे काम करता है",
      about: "हमारे बारे में",
      login: "लॉगिन",
      getStarted: "शुरू करें",
    },

    hero: {
      badge: "स्मार्ट इन्वेंटरी प्रबंधन",
      title: "अपने व्यवसाय को",
      highlight: "बेहतर और तेज़ी से प्रबंधित करें",
      description:
        "एक आसान प्लेटफ़ॉर्म के माध्यम से अपनी इन्वेंटरी, बिक्री, खरीद और व्यावसायिक गतिविधियों को प्रबंधित करें।",
      primaryButton: "शुरू करें",
      secondaryButton: "विशेषताएँ देखें",
      trusted: "अपने व्यवसाय को प्रबंधित करने का बेहतर तरीका",
    },

    dashboard: {
      overview: "अवलोकन",
      title: "इन्वेंटरी डैशबोर्ड",
      live: "लाइव",
      totalProducts: "कुल उत्पाद",
      totalSales: "कुल बिक्री",
      lowStock: "कम स्टॉक वाले उत्पाद",
      revenue: "कुल राजस्व",
      stockActivity: "स्टॉक गतिविधि",
      recentActivity: "हाल की गतिविधियाँ",
      stockUpdated: "स्टॉक अपडेट किया गया",
      newSale: "नई बिक्री पूरी हुई",
      purchaseAdded: "खरीद जोड़ी गई",
      growth: "वृद्धि",
      thisMonth: "इस महीने",
    },

    features: {
      label: "स्मार्ट सुविधाएँ",
      title: "आपके व्यवसाय के लिए आवश्यक सब कुछ",
      description:
        "अपने सभी महत्वपूर्ण व्यावसायिक कार्यों को एक सरल प्लेटफ़ॉर्म से प्रबंधित करें।",

      inventory: "इन्वेंटरी प्रबंधन",
      inventoryDesc:
        "उत्पादों को प्रबंधित करें और स्टॉक स्तर की निगरानी करें।",

      sales: "बिक्री प्रबंधन",
      salesDesc:
        "बिक्री लेनदेन और राजस्व को ट्रैक करें।",

      purchases: "खरीद प्रबंधन",
      purchasesDesc:
        "खरीद ऑर्डर और आने वाले स्टॉक को प्रबंधित करें।",

      suppliers: "आपूर्तिकर्ता प्रबंधन",
      suppliersDesc:
        "आपूर्तिकर्ताओं की जानकारी व्यवस्थित रखें।",

      analytics: "रिपोर्ट और विश्लेषण",
      analyticsDesc:
        "रिपोर्ट और चार्ट के माध्यम से व्यवसाय का प्रदर्शन समझें।",

      security: "सुरक्षित पहुँच",
      securityDesc:
        "सुरक्षित प्रमाणीकरण के साथ व्यावसायिक जानकारी की सुरक्षा करें।",
    },

    workflow: {
      label: "सरल प्रक्रिया",
      title: "तीन चरणों में अपना व्यवसाय प्रबंधित करें",
      description:
        "अपनी दैनिक व्यावसायिक गतिविधियों को व्यवस्थित करने की सरल प्रक्रिया।",

      step1: "अपने उत्पाद जोड़ें",
      step1Desc:
        "उत्पाद, श्रेणियाँ, कीमतें और स्टॉक की जानकारी जोड़ें।",

      step2: "व्यावसायिक गतिविधियाँ प्रबंधित करें",
      step2Desc:
        "बिक्री, खरीद और आपूर्तिकर्ताओं को एक ही स्थान पर प्रबंधित करें।",

      step3: "प्रदर्शन ट्रैक करें",
      step3Desc:
        "रिपोर्ट देखें और व्यावसायिक गतिविधियों की निगरानी करें।",
    },

    benefits: {
      label: "SMARTSTOCK क्यों",
      title: "बेहतर इन्वेंटरी प्रबंधन के लिए बनाया गया",
      description:
        "दैनिक व्यावसायिक कार्यों को सरल बनाएं और अपने व्यवसाय को बेहतर तरीके से प्रबंधित करें।",

      benefit1: "उपयोग में आसान डैशबोर्ड",
      benefit2: "व्यवस्थित इन्वेंटरी प्रबंधन",
      benefit3: "रीयल-टाइम स्टॉक निगरानी",
      benefit4: "व्यावसायिक रिपोर्ट और विश्लेषण",
      benefit5: "एक ही स्थान पर व्यावसायिक जानकारी",
      benefit6: "सुरक्षित उपयोगकर्ता प्रमाणीकरण",

      cardTitle: "आपका व्यवसाय। एक प्लेटफ़ॉर्म।",
      cardDescription:
        "अपनी इन्वेंटरी और व्यावसायिक गतिविधियों को एक साथ लाएँ।",
    },

    cta: {
      title: "बेहतर व्यवसाय की शुरुआत यहाँ से",
      description:
        "व्यवस्थित और कुशल व्यवसाय प्रबंधन की दिशा में अगला कदम उठाएँ।",
      button: "अभी शुरू करें",
    },

    footer: {
      description:
        "इन्वेंटरी और व्यावसायिक गतिविधियों को प्रबंधित करने के लिए एक सरल प्लेटफ़ॉर्म।",
      quickLinks: "त्वरित लिंक",
      resources: "विशेषताएँ",
      contact: "शुरू करें",
      rights: "सर्वाधिकार सुरक्षित।",
      home: "होम",
      features: "विशेषताएँ",
      workflow: "यह कैसे काम करता है",
      login: "लॉगिन",
    },

    theme: {
      light: "लाइट मोड",
      dark: "डार्क मोड",
      night: "नाइट मोड",
      change: "थीम बदलें",
    },
  },
};


const featureItems = [
  {
    key: "inventory",
    icon: Boxes,
  },
  {
    key: "sales",
    icon: ShoppingCart,
  },
  {
    key: "purchases",
    icon: Truck,
  },
  {
    key: "suppliers",
    icon: Users,
  },
  {
    key: "analytics",
    icon: BarChart3,
  },
  {
    key: "security",
    icon: ShieldCheck,
  },
];


const workflowItems = [
  {
    number: "01",
    key: "step1",
    icon: Package,
  },
  {
    number: "02",
    key: "step2",
    icon: ClipboardList,
  },
  {
    number: "03",
    key: "step3",
    icon: ChartNoAxesCombined,
  },
];


function Home() {
  const navigate = useNavigate();
  const { language, changeLanguage } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("smartstock-home-theme");

    return ["light", "dark", "night"].includes(savedTheme)
      ? savedTheme
      : "light";
  });

  const currentLanguage = content[language] ? language : "en";
  const c = content[currentLanguage];


  useEffect(() => {
    document.documentElement.setAttribute("data-home-theme", theme);

    localStorage.setItem("smartstock-home-theme", theme);
  }, [theme]);

  const changeTheme = () => {
    setTheme((previousTheme) => {
      if (previousTheme === "light") return "dark";
      if (previousTheme === "dark") return "night";
      return "light";
    });
  };

  const ThemeIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const themeLabel =
    theme === "light"
      ? c.theme.light
      : theme === "dark"
        ? c.theme.dark
        : c.theme.night;


  const handleLogin = () => {
    setMenuOpen(false);
    navigate("/admin/login");
  };

  const handleGetStarted = () => {
    setMenuOpen(false);
    navigate("/admin/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };


  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    changeLanguage(selectedLanguage);
  };


  return (
    <div className={`home-page home-theme-${theme}`}>

          
{/* ===================================== */}
      <header className="home-header">
        <nav className="home-navbar">

          <a href="#home" className="home-logo">
            <span className="home-logo-icon">
              <Boxes size={25} />
            </span>

            <span className="home-logo-text">
              Smart<span>Stock</span>
            </span>
          </a>

          <div className={`home-nav-links ${menuOpen ? "active" : ""}`}>

            <a href="#home" onClick={closeMenu}>
              {c.nav.home}
            </a>

            <a href="#features" onClick={closeMenu}>
              {c.nav.features}
            </a>

            <a href="#workflow" onClick={closeMenu}>
              {c.nav.workflow}
            </a>

            <a href="#about" onClick={closeMenu}>
              {c.nav.about}
            </a>

            <div className="home-mobile-actions">

              <button
                type="button"
                className="home-mobile-login"
                onClick={handleLogin}
              >
                {c.nav.login}
              </button>

              <button
                type="button"
                className="home-mobile-start"
                onClick={handleGetStarted}
              >
                {c.nav.getStarted}
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

          <div className="home-nav-actions">


            <select
              className="home-language-select"
              value={currentLanguage}
              onChange={handleLanguageChange}
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>


            <button
              type="button"
              className="home-theme-button"
              onClick={changeTheme}
              title={`${c.theme.change}: ${themeLabel}`}
              aria-label={`${c.theme.change}: ${themeLabel}`}
            >
              <ThemeIcon size={19} />
            </button>

            <button
              type="button"
              className="home-login-button"
              onClick={handleLogin}
            >
              {c.nav.login}
            </button>

            <button
              type="button"
              className="home-start-button"
              onClick={handleGetStarted}
            >
              {c.nav.getStarted}
              <ArrowRight size={17} />
            </button>

          </div>


          <button
            type="button"
            className="home-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

        </nav>
      </header>

      <main>

{/* ===================================== */}
        <section className="home-hero" id="home">

          <div className="home-hero-background">
            <div className="home-hero-shape home-shape-one"></div>
            <div className="home-hero-shape home-shape-two"></div>
          </div>

          <div className="home-container home-hero-container">

            <div className="home-hero-content">
               <div className="hero-info-strip">
  <div className="hero-info-item">
    <span className="hero-info-dot"></span>
    Live Stock Tracking
  </div>

  <div className="hero-info-item">
    <TrendingUp size={15} />
    Sales Insights
  </div>

  <div className="hero-info-item">
    <Package size={15} />
    Smart Inventory
  </div>
</div>
              <div className="home-hero-badge">
                <Zap size={15} />
                <span>{c.hero.badge}</span>
              </div>

              <h1>
                {c.hero.title}
                <br />
                <span>{c.hero.highlight}</span>
              </h1>

              <p className="home-hero-description">
                {c.hero.description}
              </p>

              <div className="home-hero-buttons">

                <button
                  type="button"
                  className="home-primary-button"
                  onClick={handleGetStarted}
                >
                  {c.hero.primaryButton}
                  <ArrowRight size={19} />
                </button>

                <a
                  href="#features"
                  className="home-secondary-button"
                >
                  {c.hero.secondaryButton}
                </a>

              </div>

              <div className="home-hero-trust">
                <ShieldCheck size={18} />
                <span>{c.hero.trusted}</span>
              </div>

            </div>


            <div className="home-hero-visual">

              <div className="home-dashboard-preview">

                <div className="home-dashboard-top">

                  <div className="home-dashboard-brand">
                    <span className="home-dashboard-icon">
                      <Boxes size={18} />
                    </span>

                    <span>SmartStock</span>
                  </div>

                  <span className="home-live-badge">
                    <span></span>
                    {c.dashboard.live}
                  </span>

                </div>

                <div className="home-dashboard-heading">

                  <div>
                    <span className="home-dashboard-overview">
                      {c.dashboard.overview}
                    </span>

                    <h3>{c.dashboard.title}</h3>
                  </div>

                  <div className="home-dashboard-date">
                    <Activity size={16} />
                  </div>

                </div>


                <div className="home-stat-grid">

                  <div className="home-stat-card">
                    <div className="home-stat-icon blue">
                      <Package size={19} />
                    </div>

                    <span>{c.dashboard.totalProducts}</span>

                    <h3>1,248</h3>

                    <small>
                      <TrendingUp size={13} />
                      +12.5%
                    </small>
                  </div>

                  <div className="home-stat-card">
                    <div className="home-stat-icon green">
                      <ShoppingCart size={19} />
                    </div>

                    <span>{c.dashboard.totalSales}</span>

                    <h3>856</h3>

                    <small>
                      <TrendingUp size={13} />
                      +8.2%
                    </small>
                  </div>

                  <div className="home-stat-card">
                    <div className="home-stat-icon orange">
                      <Warehouse size={19} />
                    </div>

                    <span>{c.dashboard.lowStock}</span>

                    <h3>18</h3>

                    <small className="home-stat-warning">
                      Needs attention
                    </small>
                  </div>

                  <div className="home-stat-card">
                    <div className="home-stat-icon purple">
                      <TrendingUp size={19} />
                    </div>

                    <span>{c.dashboard.revenue}</span>

                    <h3>₹2.4L</h3>

                    <small>
                      <TrendingUp size={13} />
                      +18.4%
                    </small>
                  </div>

                </div>


                <div className="home-dashboard-chart">

                  <div className="home-chart-heading">
                    <div>
                      <h4>{c.dashboard.stockActivity}</h4>
                      <span>{c.dashboard.thisMonth}</span>
                    </div>

                    <span className="home-chart-growth">
                      <TrendingUp size={14} />
                      +15.8%
                    </span>
                  </div>

                  <div className="home-chart-area">

                    <div className="home-chart-y-axis">
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>

                    <div className="home-chart-graph">

                      <div className="home-chart-grid-line"></div>
                      <div className="home-chart-grid-line"></div>
                      <div className="home-chart-grid-line"></div>
                      <div className="home-chart-grid-line"></div>

                      <svg
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                        className="home-chart-svg"
                        role="img"
                        aria-label={c.dashboard.stockActivity}
                      >
                        <defs>
                          <linearGradient
                            id="homeChartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3b82f6"
                              stopOpacity="0.25"
                            />
                            <stop
                              offset="100%"
                              stopColor="#3b82f6"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="M0 115 C35 105 45 90 80 95 S125 65 160 75 S210 95 245 60 S300 55 330 65 S380 25 410 40 S460 15 500 20 L500 150 L0 150 Z"
                          fill="url(#homeChartGradient)"
                        />

                        <path
                          d="M0 115 C35 105 45 90 80 95 S125 65 160 75 S210 95 245 60 S300 55 330 65 S380 25 410 40 S460 15 500 20"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>

                    </div>

                  </div>

                  <div className="home-chart-months">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>

                </div>


                <div className="home-dashboard-activity">

                  <h4>{c.dashboard.recentActivity}</h4>

                  <div className="home-activity-item">
                    <span className="home-activity-icon blue">
                      <Package size={15} />
                    </span>

                    <div>
                      <strong>{c.dashboard.stockUpdated}</strong>
                      <small>Samsung Galaxy S24</small>
                    </div>

                    <CheckCircle2 size={17} />
                  </div>

                  <div className="home-activity-item">
                    <span className="home-activity-icon green">
                      <ShoppingCart size={15} />
                    </span>

                    <div>
                      <strong>{c.dashboard.newSale}</strong>
                      <small>Order #SS1024</small>
                    </div>

                    <CheckCircle2 size={17} />
                  </div>

                  <div className="home-activity-item">
                    <span className="home-activity-icon purple">
                      <Truck size={15} />
                    </span>

                    <div>
                      <strong>{c.dashboard.purchaseAdded}</strong>
                      <small>New stock received</small>
                    </div>

                    <CheckCircle2 size={17} />
                  </div>

                </div>

              </div>


              <div className="home-floating-card">
                <span className="home-floating-icon">
                  <Bell size={18} />
                </span>

                <div>
                  <strong>Smart Notifications</strong>
                  <span>Stay updated with your business</span>
                </div>

                <CheckCircle2 size={18} />
              </div>

            </div>

          </div>

        </section>

{/* ===================================== */}
        <section className="home-features-section" id="features">

          <div className="home-container">

            <div className="home-section-heading">

              <span className="home-section-label">
                {c.features.label}
              </span>

              <h2>{c.features.title}</h2>

              <p>{c.features.description}</p>

            </div>

            <div className="home-features-grid">

              {featureItems.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    className="home-feature-card"
                    key={feature.key}
                  >

                    <div className={`home-feature-icon ${feature.key}`}>
                      <Icon size={25} />
                    </div>

                    <h3>{c.features[feature.key]}</h3>

                    <p>{c.features[`${feature.key}Desc`]}</p>

                    <div className="home-feature-arrow">
                      <ArrowRight size={18} />
                    </div>

                  </article>
                );
              })}

            </div>

          </div>

        </section>

{/* ===================================== */}
        <section className="home-workflow-section" id="workflow">

          <div className="home-container">

            <div className="home-section-heading">

              <span className="home-section-label">
                {c.workflow.label}
              </span>

              <h2>{c.workflow.title}</h2>

              <p>{c.workflow.description}</p>

            </div>

            <div className="home-workflow-grid">

              {workflowItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    className="home-workflow-card"
                    key={item.key}
                  >

                    <div className="home-workflow-number">
                      {item.number}
                    </div>

                    <div className="home-workflow-icon">
                      <Icon size={28} />
                    </div>

                    <h3>{c.workflow[item.key]}</h3>

                    <p>{c.workflow[`${item.key}Desc`]}</p>

                  </article>
                );
              })}

            </div>

          </div>

        </section>

{/* ===================================== */}
        <section className="home-benefits-section" id="about">

          <div className="home-container home-benefits-container">

            <div className="home-benefits-content">

              <span className="home-section-label">
                {c.benefits.label}
              </span>

              <h2>{c.benefits.title}</h2>

              <p className="home-benefits-description">
                {c.benefits.description}
              </p>

              <div className="home-benefits-list">

                {[
                  "benefit1",
                  "benefit2",
                  "benefit3",
                  "benefit4",
                  "benefit5",
                  "benefit6",
                ].map((benefit) => (
                  <div className="home-benefit-item" key={benefit}>
                    <CheckCircle2 size={19} />
                    <span>{c.benefits[benefit]}</span>
                  </div>
                ))}

              </div>

              <button
                type="button"
                className="home-primary-button"
                onClick={handleGetStarted}
              >
                {c.hero.primaryButton}
                <ArrowRight size={18} />
              </button>

            </div>

            <div className="home-benefits-visual">

              <div className="home-benefits-card">

                <div className="home-benefits-card-icon">
                  <Boxes size={35} />
                </div>

                <h3>{c.benefits.cardTitle}</h3>

                <p>{c.benefits.cardDescription}</p>

                <div className="home-benefits-card-stats">

                  <div>
                    <Package size={20} />
                    <strong>1,248</strong>
                    <span>{c.dashboard.totalProducts}</span>
                  </div>

                  <div>
                    <TrendingUp size={20} />
                    <strong>+18.4%</strong>
                    <span>{c.dashboard.growth}</span>
                  </div>

                </div>

                <div className="home-benefits-decoration">
                  <Globe size={110} />
                </div>

              </div>

            </div>

          </div>

        </section>

            
{/* ===================================== */}
        <section className="home-cta-section">

          <div className="home-container">

            <div className="home-cta-card">

              <div className="home-cta-content">

                <span className="home-cta-label">
                  SMARTSTOCK
                </span>

                <h2>{c.cta.title}</h2>

                <p>{c.cta.description}</p>

                <button
                  type="button"
                  className="home-cta-button"
                  onClick={handleGetStarted}
                >
                  {c.cta.button}
                  <ArrowRight size={19} />
                </button>

              </div>

              <div className="home-cta-decoration">
                <ChartNoAxesCombined size={150} />
              </div>

            </div>

          </div>

        </section>

      </main>

          
{/* ===================================== */}
      <footer className="home-footer">

        <div className="home-container">

          <div className="home-footer-main">

            <div className="home-footer-brand">

              <a href="#home" className="home-logo">
                <span className="home-logo-icon">
                  <Boxes size={24} />
                </span>

                <span className="home-logo-text">
                  Smart<span>Stock</span>
                </span>
              </a>

              <p>{c.footer.description}</p>

              <div className="home-footer-security">
                <ShieldCheck size={17} />
                <span>Smart and Secure Management</span>
              </div>

            </div>

            <div className="home-footer-links">

              <div className="home-footer-column">

                <h4>{c.footer.quickLinks}</h4>

                <a href="#home">{c.footer.home}</a>
                <a href="#features">{c.footer.features}</a>
                <a href="#workflow">{c.footer.workflow}</a>

              </div>

              <div className="home-footer-column">

                <h4>{c.footer.resources}</h4>

                <a href="#features">{c.features.inventory}</a>
                <a href="#features">{c.features.sales}</a>
                <a href="#features">{c.features.analytics}</a>

              </div>

              <div className="home-footer-column">

                <h4>{c.footer.contact}</h4>

                <a
                  href="#home"
                  onClick={(event) => {
                    event.preventDefault();
                    handleLogin();
                  }}
                >
                  {c.footer.login}
                </a>

                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="home-footer-start"
                >
                  {c.nav.getStarted}
                  <ArrowRight size={15} />
                </button>

              </div>

            </div>

          </div>

          <div className="home-footer-bottom">

            <p>
              © {new Date().getFullYear()} SmartStock. {c.footer.rights}
            </p>

            <span>
              <ShieldCheck size={15} />
              Smart Inventory Management
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;