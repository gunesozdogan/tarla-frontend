import React, { useState, useEffect } from "react";
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
import {
  getCities,
  getDistrictsByCityCode,
  getNeighbourhoodsByCityCodeAndDistrict,
} from "turkey-neighbourhoods";

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

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [customCropType, setCustomCropType] = useState("");

  const handleCityChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    const cityCode = selectedOptions[0].getAttribute("data-code");

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setSelectedCityCode(cityCode);
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setSelectedDistrict(value);
  };

  const handleNeighborhoodChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.province) {
      const districts = getDistrictsByCityCode(selectedCityCode);

      setDistricts(districts);
      setFormData((prev) => ({ ...prev, district: "", neighborhood: "" }));
      setNeighborhoods([]);
    }
  }, [formData.province, selectedCityCode]);

  useEffect(() => {
    if (formData.district) {
      const neighborhoods = getNeighbourhoodsByCityCodeAndDistrict(
        selectedCityCode,
        selectedDistrict
      );
      setNeighborhoods(neighborhoods);
      setFormData((prev) => ({ ...prev, neighborhood: "" }));
    }
  }, [formData.district, selectedCityCode, selectedDistrict]);

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
    { id: 10, label: t("addListingPage.cropTypeOptions.grapes") },
    { id: 11, label: t("addListingPage.cropTypeOptions.other") },
  ];

  const soilQualityOptions = [
    { id: 1, label: t("addListingPage.soilQualityOptions.veryRich") },
    { id: 2, label: t("addListingPage.soilQualityOptions.rich") },
    { id: 3, label: t("addListingPage.soilQualityOptions.medium") },
    { id: 4, label: t("addListingPage.soilQualityOptions.poor") },
    { id: 5, label: t("addListingPage.soilQualityOptions.veryPoor") },
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

    if (formData.cropTypes.length === 0) {
      setError(t("addListingPage.croptypeMissing"));
      return;
    }

    if (formData.cropTypes.includes(11) && !customCropType.trim()) {
      setError(t("addListingPage.cropTypeOptions.errorEnterOtherCrop"));
      return;
    }

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

      // Transform cropTypes into objects
      const crops = formData.cropTypes.map((id) => {
        if (id === 11) {
          return { id, customName: customCropType }; // include typed value
        }
        return { id };
      });

      const finalData = {
        ...formData,
        location,
        photos: photoUrls,
        cropTypes: crops, // send transformed array
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
      <div className="add-listing-form-container-outer">
        <form onSubmit={handleSubmit} className="add-listing-form-container">
          <div className="add-listing-photo-upload-section">
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

          <span className="add-listing-required-field">
            Required Fields (*)
          </span>

          <div className="add-listing-form-section">
            <label>
              <span>
                <FaFileAlt /> {t("addListingPage.name")}:
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              <span>
                <FaMapMarkerAlt /> {t("addListingPage.province")}:
              </span>
              <select
                name="province"
                value={formData.province}
                onChange={handleCityChange}
                required
                className="add-listing-modern-dropdown"
              >
                <option value="">{t("addListingPage.selectProvince")}</option>
                {getCities().map((city) => (
                  <option
                    key={city.code}
                    value={city.name}
                    data-code={city.code}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>
                <FaMapMarkerAlt /> {t("addListingPage.district")}:
              </span>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                required
                className="add-listing-modern-dropdown"
                disabled={!districts.length}
              >
                <option value="">{t("addListingPage.selectDistrict")}</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>
                <FaMapMarkerAlt /> {t("addListingPage.neighborhood")}:
              </span>
              <select
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleNeighborhoodChange}
                required
                className="add-listing-modern-dropdown"
                disabled={!neighborhoods.length}
              >
                <option value="">
                  {t("addListingPage.selectNeighborhood")}
                </option>
                {neighborhoods.map((neighborhood, index) => (
                  <option
                    key={index}
                    value={neighborhood.replace(/\s*Mah.*/, "")}
                  >
                    {neighborhood}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="add-listing-form-section">
            <label>
              <span>
                <FaLandmark /> {t("addListingPage.ada")}:
              </span>
              <input
                type="text"
                name="ada"
                value={formData.ada}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              <span>
                <FaLandmark /> {t("addListingPage.parsel")}:
              </span>
              <input
                type="text"
                name="parsel"
                value={formData.parsel}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              <span>
                <FaDollarSign /> {t("addListingPage.price")}:
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              <span>
                <FaTint /> {t("addListingPage.annualRainfall")}:
              </span>
              <input
                type="number"
                name="annualRainfall"
                value={formData.annualRainfall}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div className="add-listing-form-section">
            <label>
              <span>
                <FaSeedling /> {t("addListingPage.soilQuality")}:
              </span>
              <select
                name="soilQualityId"
                value={formData.soilQualityId}
                onChange={handleInputChange}
                required
                className="add-listing-modern-dropdown full-width-input2"
              >
                <option value="">
                  {t("addListingPage.selectSoilQuality")}
                </option>
                {soilQualityOptions.map((quality) => (
                  <option key={quality.id} value={quality.id}>
                    {quality.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>
                <FaClipboardList /> {t("addListingPage.description")}:
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="add-listing-modern-textarea full-width-input larger-textarea"
                placeholder={t("addListingPage.placeholderDescription")}
              />
            </label>
            <label>
              <span>
                <FaClipboardList /> {t("addListingPage.historicalData")}:
              </span>
              <textarea
                name="historicalData"
                value={formData.historicalData}
                onChange={handleInputChange}
                className="add-listing-modern-textarea full-width-input larger-textarea"
                placeholder={t("addListingPage.placeholderHistoricalData")}
                required
              />
            </label>
          </div>

          <fieldset className="add-listing-crop-selection">
            <legend>
              <FaSeedling /> {t("addListingPage.cropTypes")}:
            </legend>
            <div className="add-listing-crop-grid">
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
              {formData.cropTypes.includes(11) && (
                <input
                  type="text"
                  placeholder={t(
                    "addListingPage.cropTypeOptions.otherCropTypes"
                  )}
                  value={customCropType}
                  onChange={(e) => setCustomCropType(e.target.value)}
                  className="custom-crop-input"
                />
              )}
            </div>
          </fieldset>

          <button type="submit" className="add-listing-submit-btn">
            {t("addListingPage.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
