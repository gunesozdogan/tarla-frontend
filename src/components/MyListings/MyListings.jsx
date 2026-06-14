import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaLiraSign,
  FaPen,
  FaChartLine,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaLock,
} from "react-icons/fa";
import "./MyListings.css";

const MyListings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await axios.get("/api/fields/mine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setListings(response.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setSessionExpired(true);
        } else {
          console.error("Error fetching listings:", err);
          setError(t("myListings.errorLoading"));
        }
      }
    };

    fetchUserListings();
  }, [t]);

  const handleDeleteClick = (listing) => {
    setSelectedListing(listing);
    setShowDeletePopup(true);
    setDeleteError("");
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

      const remaining = listings.filter(
        (listing) => listing.id !== selectedListing.id,
      );
      setListings(remaining);
      const lastPage = Math.max(1, Math.ceil(remaining.length / PAGE_SIZE));
      if (currentPage > lastPage) setCurrentPage(lastPage);
      closePopup();
    } catch (err) {
      console.error("Error deleting listing:", err);
      setDeleteError(t("myListings.deleteError"));
    }
  };

  const totalPages = Math.ceil(listings.length / PAGE_SIZE);
  const paginatedListings = listings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const MAX_VISIBLE_PAGES = 10;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  const pageNumbers = [];
  for (let p = startPage; p <= endPage; p++) pageNumbers.push(p);

  if (sessionExpired) {
    return (
      <div className="my-listings-page">
        <div className="session-expired">
          <span className="session-expired__icon">
            <FaLock />
          </span>
          <h2>{t("myListings.sessionExpired")}</h2>
          <button
            className="session-expired__btn"
            onClick={() => navigate("/login")}
          >
            {t("navbar.login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-listings-page">
      <h1>{t("myListings.title")}</h1>
      {error && <p className="my-listings-error">{error}</p>}

      {listings.length === 0 ? (
        <p className="my-listings-no-items">{t("myListings.noItems")}</p>
      ) : (
        <>
          <div className="my-listings-grid">
            {paginatedListings.map((listing) => (
              <div key={listing.id} className="my-listing-card">
                <h2>{listing.name}</h2>
                <p>
                  <FaMapMarkerAlt />
                  <strong>{t("myListings.locationLabel")}</strong>{" "}
                  {listing.location}
                </p>
                <p>
                  <FaRulerCombined />
                  <strong>{t("myListings.sizeLabel")}</strong>{" "}
                  {listing.size != null
                    ? `${Math.round(Number(listing.size)).toLocaleString()} m²`
                    : "-"}
                </p>
                <p>
                  <FaLiraSign />
                  <strong>{t("myListings.priceLabel")}</strong>{" "}
                  {listing.price != null
                    ? `${Number(listing.price).toLocaleString("tr-TR")} ₺`
                    : "-"}
                </p>
                <div className="my-listing-actions">
                  <button
                    className="my-listing-action-btn my-listing-edit-btn"
                    onClick={() => navigate(`/editlisting/${listing.id}`)}
                  >
                    <FaPen /> {t("myListings.editButton")}
                  </button>
                  <button
                    className="my-listing-action-btn my-listing-analytics-btn"
                    onClick={() =>
                      navigate(`/mylistings/${listing.id}/analytics`)
                    }
                  >
                    <FaChartLine /> {t("myListings.analyticsButton")}
                  </button>
                  <button
                    className="my-listing-action-btn my-listing-delete-btn"
                    onClick={() => handleDeleteClick(listing)}
                  >
                    <FaTrash /> {t("myListings.deleteButton")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
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
