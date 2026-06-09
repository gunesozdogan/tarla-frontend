import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./NotificationPage.css";
import { FaBell, FaCheck, FaClock } from "react-icons/fa";

const NotificationPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/users/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(t("notificationPage.error"));
      }
    };
    fetchNotifications();
  }, [t]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `/api/users/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif,
        ),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="notification-page">
      <h1>
        <FaBell /> {t("notificationPage.title")}
      </h1>
      {error ? (
        <p className="notification-error">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="no-notifications">
          {t("notificationPage.noNotifications")}
        </p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item ${notif.read ? "read" : "unread"}`}
            >
              <div className="notification-content">
                <span className="notification-text">{notif.explanation}</span>
                <span className="notification-time">
                  <FaClock className="time-icon" />{" "}
                  {formatTimestamp(notif.created_at)}
                </span>
              </div>
              {!notif.read && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notif.id)}
                >
                  <FaCheck />
                  {t("notificationPage.markAsRead")}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
