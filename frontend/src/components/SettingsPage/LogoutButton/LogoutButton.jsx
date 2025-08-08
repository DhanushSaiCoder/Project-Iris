import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./LogoutButton.module.css";
import { LogOut } from "lucide-react";
const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
                        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut/> Logout
        </button>
    );
};

export default LogoutButton;