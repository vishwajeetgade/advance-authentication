import { useState, useEffect } from "react";
import axios from "axios";
import "./PrivateScreen.css";

const PrivateScreen = ({history}) => {
    const [error, setError] = useState("");
    const [privateData, setPrivateData] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            history.push("/login");
        }
        
        const fetchPrivateDate = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            };

            try {
                const { data } = await axios.get("/api/auth/private", config);
                setPrivateData(data.message);
            } catch (error) {
                localStorage.removeItem("authToken");
                setError("You are not authorized please login");
            }
        };

        fetchPrivateDate();
    }, []);
    return error ? (
        <span className="error-message">{error}</span>
    ) : (
        <div>{privateData}</div>
    );
};

export default PrivateScreen;