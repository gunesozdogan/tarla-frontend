import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MyListings.css";

const MyListings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await axios.get("/api/fields/mine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(t("myListings.errorLoading"));
      }
    };

    fetchUserListings();
  }, [t]);

  const handleDeleteClick = (listing) => {
    setSelectedListing(listing);
    setShowDeletePopup(true);
    setDeleteError(""); // Reset previous error
  };

  const closePopup = () => {
    setShowDeletePopup(false);
    setSelectedListing(null);
  };

  const confirmDelete = async () => {
    if (!selectedListing) return;
    try {
      await axios.delete(`/api/fields/${selectedListing.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setListings(
        listings.filter((listing) => listing.id !== selectedListing.id)
      );
      closePopup();
    } catch (err) {
      console.error("Error deleting listing:", err);
      setDeleteError(t("myListings.deleteError"));
    }
  };

  return (
    <div className="my-listings-page">
      <h1>{t("myListings.title")}</h1>
      {error && <p className="my-listings-error">{error}</p>}
      {listings.length === 0 ? (
        <p className="my-listings-no-items">{t("myListings.noItems")}</p>
      ) : (
        <div className="my-listings-grid">
          {listings.map((listing) => (
            <div key={listing.id} className="my-listing-card">
              <h2>{listing.name}</h2>
              <p>
                📍 <strong>{t("myListings.locationLabel")}</strong>{" "}
                {listing.location}
              </p>
              <p>
                📏 <strong>{t("myListings.sizeLabel")}</strong> {listing.size}{" "}
                acres
              </p>
              <p>
                💵 <strong>{t("myListings.priceLabel")}</strong> $
                {listing.price.toLocaleString()}
              </p>
              <div className="my-listing-actions">
                <button
                  className="my-listing-action-btn my-listing-edit-btn"
                  onClick={() => navigate(`/editlisting/${listing.id}`)}
                >
                  {t("myListings.editButton")}
                </button>
                <button
                  className="my-listing-action-btn my-listing-analytics-btn"
                  onClick={() =>
                    navigate(`/mylistings/${listing.id}/analytics`)
                  }
                >
                  {t("myListings.analyticsButton")}
                </button>
                <button
                  className="my-listing-action-btn my-listing-delete-btn"
                  onClick={() => handleDeleteClick(listing)}
                >
                  {t("myListings.deleteButton")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>{t("myListings.deletePopupTitle")}</h3>
            <p>
              {t("myListings.deletePopupMessage")}{" "}
              <strong>{selectedListing.name}</strong>?
            </p>
            {deleteError && <p className="delete-error">{deleteError}</p>}
            <div className="popup-actions">
              <button className="popup-btn cancel-btn" onClick={closePopup}>
                {t("myListings.cancelButton")}
              </button>
              <button className="popup-btn delete-btn" onClick={confirmDelete}>
                {t("myListings.deleteButtonPopup")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
