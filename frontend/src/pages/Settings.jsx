import { useState } from "react";

import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Package,
  IndianRupee,
  Save,
  RotateCcw,
  CheckCircle
} from "lucide-react";

import "./Settings.css";

const defaultSettings = {
  companyName: "Smart Inventory System",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  lowStockThreshold: 10,
  emailNotifications: true,
  lowStockAlerts: true,
  salesAlerts: true,
  purchaseAlerts: true
};

function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...defaultSettings,
        ...JSON.parse(
          localStorage.getItem("smartstock-settings") || "{}"
        )
      };
    } catch {
      return defaultSettings;
    }
  });

  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "smartstock-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(
      "smartstock-settings",
      JSON.stringify(defaultSettings)
    );

    setSaved(false);
  };

  return (
    <div className="settings-page">

      {/* Header */}

      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your application preferences and configurations.</p>
        </div>
      </div>

      {/* General Settings */}

      <div className="settings-card">

        <div className="settings-card-heading">
          <div className="settings-heading-icon blue">
            <SettingsIcon size={21} />
          </div>

          <div>
            <h2>General Settings</h2>
            <p>Configure your application information.</p>
          </div>
        </div>

        <div className="settings-form-grid">

          <div className="settings-field">
            <label>Application Name</label>

            <input
              type="text"
              value={settings.companyName}
              onChange={(e) =>
                updateSetting("companyName", e.target.value)
              }
            />
          </div>

          <div className="settings-field">
            <label>Currency</label>

            <select
              value={settings.currency}
              onChange={(e) =>
                updateSetting("currency", e.target.value)
              }
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          <div className="settings-field">
            <label>Date Format</label>

            <select
              value={settings.dateFormat}
              onChange={(e) =>
                updateSetting("dateFormat", e.target.value)
              }
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

        </div>

      </div>

      {/* Inventory Settings */}

      <div className="settings-card">

        <div className="settings-card-heading">
          <div className="settings-heading-icon orange">
            <Package size={21} />
          </div>

          <div>
            <h2>Inventory Configuration</h2>
            <p>Set your inventory monitoring preferences.</p>
          </div>
        </div>

        <div className="settings-field settings-threshold-field">
          <label>Low Stock Threshold</label>

          <input
            type="number"
            min="0"
            value={settings.lowStockThreshold}
            onChange={(e) =>
              updateSetting(
                "lowStockThreshold",
                Math.max(0, Number(e.target.value))
              )
            }
          />

          <span>
            Default threshold for inventory monitoring.
          </span>
        </div>

      </div>

      {/* Notification Settings */}

      <div className="settings-card">

        <div className="settings-card-heading">
          <div className="settings-heading-icon purple">
            <Bell size={21} />
          </div>

          <div>
            <h2>Notification Preferences</h2>
            <p>Choose which inventory updates you want to receive.</p>
          </div>
        </div>

        <div className="settings-options">

          {[
            {
              key: "emailNotifications",
              title: "Email Notifications",
              description: "Enable email notification preferences."
            },
            {
              key: "lowStockAlerts",
              title: "Low Stock Alerts",
              description: "Receive alerts when products reach low stock."
            },
            {
              key: "salesAlerts",
              title: "Sales Notifications",
              description: "Enable notifications for sales activities."
            },
            {
              key: "purchaseAlerts",
              title: "Purchase Notifications",
              description: "Enable notifications for purchase activities."
            }
          ].map((item) => (
            <div className="settings-option" key={item.key}>

              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) =>
                    updateSetting(item.key, e.target.checked)
                  }
                />

                <span className="settings-slider"></span>
              </label>

            </div>
          ))}

        </div>

      </div>

      {/* Actions */}

      <div className="settings-actions">

        <button
          className="settings-reset-btn"
          onClick={resetSettings}
        >
          <RotateCcw size={17} />
          Reset Settings
        </button>

        <button
          className="settings-save-btn"
          onClick={saveSettings}
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>

      {saved && (
        <div className="settings-success">
          <CheckCircle size={18} />
          Settings saved successfully!
        </div>
      )}

    </div>
  );
}

export default Settings;