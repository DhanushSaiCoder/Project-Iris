import React, { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./LogoutButton.module.css";
import { LogOut } from "lucide-react";
import ConfirmModal from './../../common/ConfirmModal/ConfirmModal';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleLogoutClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmLogout = () => {
        logout();
        navigate("/login");
        setShowConfirmModal(false);
    };

    const handleCancelLogout = () => {
        setShowConfirmModal(false);
    };

    return (
        <>
            <button onClick={handleLogoutClick} className={styles.logoutBtn}>
                <LogOut /> Logout
            </button>

            {showConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to log out?"
                    onConfirm={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                />
            )}
        </>
    );
};

export default LogoutButton;