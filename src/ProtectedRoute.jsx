import React from "react";
import LoginWarning from "./LoginWarning";

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <LoginWarning />;
    }
    return children;
};

export default ProtectedRoute;