import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import adminAuthService from "../services/adminAuthService";
import { useTranslation } from "../context/TranslationContext";

import "./AdminLogin.css";

function AdminLogin() {

  const navigate = useNavigate();

  const { language, changeLanguage, t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();
    setErrorKey("");

    if (!email.trim() || !password) {
      setErrorKey("enterCredentials");
      return;
    }

    try {

      setLoading(true);

      const user = await adminAuthService.login(
        email.trim(),
        password
      );

      if (user.role !== "ADMIN") {
        adminAuthService.logout();
        setErrorKey("unauthorized");
        return;
      }

      navigate("/dashboard", { replace: true });

    } catch (err) {

      if (err.response?.status === 401) {
        setErrorKey("invalidCredentials");
      } else if (err.response?.status === 403) {
        setErrorKey("noAdminAccess");
      } else {
        setErrorKey("serverError");
      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-brand">

          <div className="admin-login-logo">
            <ShieldCheck size={30} />
          </div>

          <div className="login-language-selector">

            <label htmlFor="loginLanguage">
              {t("language")}
            </label>

            <select
              id="loginLanguage"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>

          </div>

          <h1>{t("smartInventory")}</h1>

          <p>{t("managementSystem")}</p>

        </div>

        <div className="admin-login-heading">

          <h2>{t("adminLogin")}</h2>

          <p>{t("signInDescription")}</p>

        </div>

        <form onSubmit={handleLogin}>

          <div className="admin-login-field">

            <label>{t("email")}</label>

            <div className="admin-login-input">

              <Mail size={19} />

              <input
                type="email"
                placeholder={t("enterEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />

            </div>

          </div>

          <div className="admin-login-field">

            <label>{t("password")}</label>

            <div className="admin-login-input">

              <LockKeyhole size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("enterPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? t("hidePassword")
                    : t("showPassword")
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          {errorKey && (

            <div className="admin-login-error">
              {t(errorKey)}
            </div>

          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading ? t("signingIn") : t("signIn")}

          </button>

        </form>

        <div className="admin-login-security">

          <LockKeyhole size={15} />

          <span>{t("secureAdminAccess")}</span>

        </div>

      </div>

      <p className="admin-login-footer">
        {t("copyright")}
      </p>

    </div>

  );

}

export default AdminLogin;