import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "./ProfilePage.css";
import editIcon from "../../assets/edit-icon.png"; // Icon for editing fields

const ProfilePage = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(t("profilePage.errorMessage"));
      }
    };

    fetchUserProfile();
  }, [t]);

  const handleEditClick = (field) => {
    setEditField(field);
    setFormData({ ...formData, [field]: user[field] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (field) => {
    if (!formData[field]) {
      setError(`${field} ${t("profilePage.notSet")}`);
      return;
    }

    try {
      const response = await axios.put(
        `/api/users/me`,
        {
          ...user, // Merge old user data with new updates
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      setUser(response.data.user);
      setEditField(null);
      setSuccess(t("profilePage.successMessage"));
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(t("profilePage.profileError"));
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put(`/api/users/me/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setSuccess(t("profilePage.successMessage"));
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      setError(t("profilePage.passwordChangeError"));
    }
  };

  if (!user)
    return <p className="profile-loading">{t("profilePage.loading")}</p>;

  return (
    <div className="profile-container">
      <h1>{t("profilePage.title")}</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {["username", "email", "phoneNumber"].map((field) => (
        <div key={field} className="profile-field">
          <label>{t(`profilePage.${field}`)}:</label>
          {editField === field ? (
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="profile-input"
            />
          ) : (
            <p className="profile-text">
              {user[field] || t("profilePage.notSet")}
            </p>
          )}
          <button className="edit-btn" onClick={() => handleEditClick(field)}>
            <img
              src={editIcon}
              alt={t("profilePage.edit")}
              className="edit-icon"
            />
          </button>
          {editField === field && (
            <button className="save-btn" onClick={() => handleSave(field)}>
              {t("profilePage.save")}
            </button>
          )}
        </div>
      ))}

      <div className="password-change">
        <h2>{t("profilePage.changePassword")}</h2>
        <input
          type="password"
          className="profile-input"
          placeholder={t("profilePage.oldPassword")}
          id="old password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, oldPassword: e.target.value })
          }
        />
        <input
          type="password"
          className="profile-input"
          placeholder={t("profilePage.newPassword")}
          value={passwordData.newPassword}
          id="new password"
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
        />
        <button className="save-btn" onClick={handlePasswordChange}>
          {t("profilePage.save")}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
