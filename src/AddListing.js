import React, { useState } from "react";
import axios from "axios";
import "./AddListing.css";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaSeedling,
  FaTint,
  FaFileAlt,
  FaClipboardList,
  FaLandmark,
  FaUpload,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AddListing = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    province: "",
    district: "",
    neighborhood: "",
    ada: "",
    parsel: "",
    price: "",
    description: "",
    cropTypes: [],
    photos: [],
    soilQualityId: "",
    annualRainfall: "",
    historicalData: "",
    boosted: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const cropTypeOptions = [
    { id: 1, label: t("addListingPage.cropTypeOptions.wheat") },
    { id: 2, label: t("addListingPage.cropTypeOptions.corn") },
    { id: 3, label: t("addListingPage.cropTypeOptions.rice") },
    { id: 4, label: t("addListingPage.cropTypeOptions.barley") },
    { id: 5, label: t("addListingPage.cropTypeOptions.soybeans") },
    { id: 6, label: t("addListingPage.cropTypeOptions.cotton") },
    { id: 7, label: t("addListingPage.cropTypeOptions.sugarcane") },
    { id: 8, label: t("addListingPage.cropTypeOptions.potatoes") },
    { id: 9, label: t("addListingPage.cropTypeOptions.tomatoes") },
    { id: 10, label: t("addListingPage.cropTypeOptions.grapes") }
  ];

  const soilQualityOptions = [
    { id: 1, label: t("addListingPage.soilQualityOptions.veryRich") },
    { id: 2, label: t("addListingPage.soilQualityOptions.rich") },
    { id: 3, label: t("addListingPage.soilQualityOptions.medium") },
    { id: 4, label: t("addListingPage.soilQualityOptions.poor") },
    { id: 5, label: t("addListingPage.soilQualityOptions.veryPoor") }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      cropTypes: prevData.cropTypes.includes(id)
        ? prevData.cropTypes.filter((type) => type !== id)
        : [...prevData.cropTypes, id],
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let photoUrls = [];

      if (imageFiles.length > 0) {
        const imageData = new FormData();
        imageFiles.forEach((file) => imageData.append("photos", file));

        const uploadResponse = await axios.post(
          "/api/fields/upload",
          imageData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        photoUrls = uploadResponse.data.images;
      }

      const location = `${formData.province}, ${formData.district}, ${formData.neighborhood}`;
      const finalData = {
        ...formData,
        location,
        photos: photoUrls,
      };

      await axios.post("/api/fields", finalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(t("addListingPage.success"));
      setError("");
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(t("addListingPage.error"));
      setSuccess("");
    }
  };

  return (
    <div className="add-listing-page">
      <h1>{t("addListingPage.title")}</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <label>
            <FaFileAlt /> {t("addListingPage.name")}:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <FaMapMarkerAlt /> {t("addListingPage.province")}:
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <FaMapMarkerAlt /> {t("addListingPage.district")}:
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <FaMapMarkerAlt /> {t("addListingPage.neighborhood")}:
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            <FaLandmark /> {t("addListingPage.ada")}:
            <input
              type="text"
              name="ada"
              value={formData.ada}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <FaLandmark /> {t("addListingPage.parsel")}:
            <input
              type="text"
              name="parsel"
              value={formData.parsel}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <FaDollarSign /> {t("addListingPage.price")}:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <FaTint /> {t("addListingPage.annualRainfall")}:
            <input
              type="number"
              name="annualRainfall"
              value={formData.annualRainfall}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            <FaSeedling /> {t("addListingPage.soilQuality")}:
            <select
              name="soilQualityId"
              value={formData.soilQualityId}
              onChange={handleInputChange}
              required
              className="modern-dropdown full-width-input2"
            >
              <option value="">{t("addListingPage.selectSoilQuality")}</option>
              {soilQualityOptions.map((quality) => (
                <option key={quality.id} value={quality.id}>
                  {quality.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <FaClipboardList /> {t("addListingPage.description")}:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="modern-textarea full-width-input larger-textarea"
              placeholder={t("addListingPage.placeholderDescription")}
            />
          </label>
          <label>
            <FaClipboardList /> {t("addListingPage.historicalData")}:
            <textarea
              name="historicalData"
              value={formData.historicalData}
              onChange={handleInputChange}
              className="modern-textarea full-width-input larger-textarea"
              placeholder={t("addListingPage.placeholderHistoricalData")}
            />
          </label>
        </div>

        <fieldset className="crop-selection">
          <legend>
            <FaSeedling /> {t("addListingPage.cropTypes")}:
          </legend>
          <div className="crop-grid">
            {cropTypeOptions.map((type) => (
              <label key={type.id} className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.cropTypes.includes(type.id)}
                  onChange={() => handleCheckboxChange(type.id)}
                />
                {type.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="photo-upload-section">
          <label className="photo-upload-label">
            <FaUpload /> {t("addListingPage.uploadPhotos")}:
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <div className="photo-preview">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Preview"
                className="photo-thumbnail"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {t("addListingPage.submit")}
        </button>
      </form>
    </div>
  );
};

export default AddListing;
