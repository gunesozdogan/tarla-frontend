import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OauthSuccess = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const getTokenAndUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);

        try {
          const response = await axios.get("/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data;

          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);

          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    getTokenAndUser();
  }, [navigate, setUser]);

  return <div>Logging in via OAuth...</div>;
};

export default OauthSuccess;
