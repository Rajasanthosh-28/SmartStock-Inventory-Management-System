import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const TranslationContext = createContext(null);

const API_URL =
  "https://smartstock-backend-r5xq.onrender.com/api/translations";

const SUPPORTED_LANGUAGES = ["en", "ta", "hi"];

const getCachedTranslations = (language) => {
  try {
    const cached = localStorage.getItem(
      `smartstock-translations-${language}`
    );

    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error("Cached translation loading failed:", error);
    return {};
  }
};

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    localStorage.getItem("smartstock-language") || "en"
  );

  const [translations, setTranslations] = useState(() =>
    getCachedTranslations(
      localStorage.getItem("smartstock-language") || "en"
    )
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchTranslations = async () => {

      // Immediately display cached translations.
      const cachedTranslations = getCachedTranslations(language);

      if (active && Object.keys(cachedTranslations).length > 0) {
        setTranslations(cachedTranslations);
      }

      // Avoid unnecessary API requests while offline.
      if (!navigator.onLine) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/${language}`);

        if (!response.ok) {
          throw new Error(
            `Translation request failed: ${response.status}`
          );
        }

        const data = await response.json();

        if (active && data && typeof data === "object") {
          setTranslations(data);

          localStorage.setItem(
            `smartstock-translations-${language}`,
            JSON.stringify(data)
          );

          localStorage.setItem("smartstock-language", language);
        }

      } catch (error) {
        console.error("Translation error:", error);

        // Retain previously cached translations.
        if (active) {
          setTranslations(cachedTranslations);
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const handleOnline = () => {
      fetchTranslations();
    };

    fetchTranslations();

    window.addEventListener("online", handleOnline);

    return () => {
      active = false;
      window.removeEventListener("online", handleOnline);
    };

  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
      return;
    }

    localStorage.setItem("smartstock-language", newLanguage);

    setTranslations(getCachedTranslations(newLanguage));
    setLanguage(newLanguage);
  };

  const t = (key, values = {}) => {
    let value = translations[key] || key;

    Object.entries(values).forEach(([name, replacement]) => {
      value = String(value).replaceAll(
        `{${name}}`,
        String(replacement)
      );
    });

    return value;
  };

  return (
    <TranslationContext.Provider
      value={{
        language,
        changeLanguage,
        translations,
        loading,
        t
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      "useTranslation must be used inside TranslationProvider"
    );
  }

  return context;
}