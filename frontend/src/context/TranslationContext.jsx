import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const TranslationContext = createContext(null);
const API_URL = "http://localhost:8080/api/translations";

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    localStorage.getItem("smartstock-language") || "en"
  );
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/${language}`);
        if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
        const data = await response.json();
        if (active) {
          setTranslations(data);
          localStorage.setItem("smartstock-language", language);
        }
      } catch (error) {
        console.error("Translation error:", error);
        if (active) setTranslations({});
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTranslations();
    return () => { active = false; };
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (!["en", "ta", "hi"].includes(newLanguage)) return;
    localStorage.setItem("smartstock-language", newLanguage);
    setLanguage(newLanguage);
  };

  // Missing keys remain readable while the corresponding page is being translated.
  const t = (key, values = {}) => {
    let value = translations[key] || key;
    Object.entries(values).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  };

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, translations, loading, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used inside TranslationProvider");
  return context;
}
