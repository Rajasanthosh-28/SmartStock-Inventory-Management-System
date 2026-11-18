import {
  UserRound,
  ShieldCheck,
  Globe,
  LogOut,
  Mail,
  CheckCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import adminAuthService from "../services/adminAuthService";
import { useTranslation } from "../context/TranslationContext";

import "./Profile.css";

function Profile() {

  const navigate = useNavigate();
  const user = adminAuthService.getUser();

  const { language, changeLanguage, t } = useTranslation();

  const saveLanguage = () => {
    localStorage.setItem("smartstock-language", language);
    alert(t("languageSaved"));
  };

  const logout = () => {
    adminAuthService.logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <div>
          <h1>{t("MyProfile")}</h1>
          <p>{t("profileDescription")}</p>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="profile-card">

        <div className="profile-card-heading">
          <div className="profile-icon">
            <UserRound size={21} />
          </div>

          <div>
            <h2>{t("personalInformation")}</h2>
            <p>{t("personalInformationDescription")}</p>
          </div>
        </div>

        <div className="profile-avatar-large">
          {(user?.fullName || "A").charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">

          <div className="profile-detail-item">
            <label>{t("fullName")}</label>
            <strong>{user?.fullName || "Admin User"}</strong>
          </div>

          <div className="profile-detail-item">
            <label>{t("email")}</label>
            <strong>{user?.email || "Not available"}</strong>
          </div>

          <div className="profile-detail-item">
            <label>{t("accountRole")}</label>
            <strong>{t("Administrator")}</strong>
          </div>

        </div>
      </div>

      {/* LANGUAGE PREFERENCES */}
      <div className="profile-card">

        <div className="profile-card-heading">

          <div className="profile-icon">
            <Globe size={21} />
          </div>

          <div>
            <h2>{t("languagePreferences")}</h2>
            <p>{t("languageDescription")}</p>
          </div>

        </div>

        <div className="profile-language-section">

          <div className="profile-language-control">

            <label htmlFor="profileLanguage">
              {t("language")}
            </label>

            <select
              id="profileLanguage"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>

          </div>

          <button
            className="profile-save-language"
            onClick={saveLanguage}
          >
            <CheckCircle size={17} />
            {t("savePreference")}
          </button>

        </div>

      </div>

      {/* ACCOUNT SECURITY */}
      <div className="profile-card profile-security">

        <div className="profile-card-heading">

          <div className="profile-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2>{t("accountSecurity")}</h2>
            <p>{t("securityDescription")}</p>
          </div>

        </div>

        <button
          className="profile-logout"
          onClick={logout}
        >
          <LogOut size={18} />
          {t("logout")}
        </button>

      </div>

    </div>
  );
}

export default Profile;