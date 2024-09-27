import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);

  useEffect(() => {
    console.log("Authorization code:", code);
    if (!code) {
      console.error("Authorization code is missing or invalid.");
      return;
    }
    axios
      .post("http://localhost:5000/login", { code })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  // Observe state changes
  useEffect(() => {
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Expires In:", expiresIn, "seconds");
  }, [accessToken, refreshToken, expiresIn]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) {
      console.log("Missing refresh token or expires in.");
      return;
    }
    const interval = setInterval(() => {
      axios
        .post("http://localhost:5000/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
