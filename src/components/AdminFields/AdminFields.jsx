import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminFields.css";
import { useTranslation } from "react-i18next";

const AdminFields = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get("/api/fields", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFields(response.data);
      } catch (err) {
        console.error("Error fetching fields:", err);
        setError(t("adminFieldsPage.loadError"));
      }
    };

    fetchFields();
  }, [t]);

  const handleDelete = async (fieldId) => {
    if (!window.confirm(t("adminFieldsPage.deleteConfirm"))) return;

    try {
      await axios.delete(`/api/fields/admin/${fieldId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFields(fields.filter((field) => field.id !== fieldId));
    } catch (err) {
      console.error("Error deleting field:", err);
      setError(t("adminFieldsPage.deleteError"));
    }
  };

  return (
    <div className="admin-fields-page">
      <h1 className="admin-fields-title">{t("adminFieldsPage.title")}</h1>
      {error && <p className="admin-field-error">{error}</p>}
      <div className="admin-fields-grid">
        {fields.length === 0 ? (
          <p className="admin-field-error">{t("adminFieldsPage.noFields")}</p>
        ) : (
          fields.map((field) => (
            <div key={field.id} className="admin-field-card">
              <h2 className="admin-field-title">{field.name}</h2>
              <p className="admin-field-info">
                <strong>{t("adminFieldsPage.location")}:</strong>{" "}
                {field.location}
              </p>
              <p className="admin-field-info">
                <strong>{t("adminFieldsPage.size")}:</strong> {field.size}{" "}
                {t("adminFieldsPage.unit")}
              </p>
              <button
                className="admin-field-delete-btn"
                onClick={() => handleDelete(field.id)}
              >
                {t("adminFieldsPage.delete")}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFields;
