import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../config";

function SendCode() {
  const [codeTime, setCodeTime] = useState(60);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [send, setSend] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (codeTime > 0) {
        setCodeTime((prevCount) => prevCount - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [send , codeTime]);

  useEffect(() => {
    setLoading(true);
    if (Cookie.get("tkn")) {
      axios
        .post(`${BaseUrl}/getInfo`, { token: Cookie.get("tkn") })
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            if (res.data.data.verified) {
              navigate("/home");
            } else {
              setInfo(res.data.data.email);
            }
          } else {
            Cookie.remove("tkn");
            navigate("/Login");
          }
        });
    } else {
      setTimeout(() => {
        setLoading(false);
        navigate("/Login");
      }, 2000);
    }
  }, [navigate]);

  const handleResend = () => {
    if (codeTime < 1) {
      axios
        .post(`${BaseUrl}/SendMail`, { token: Cookie.get("tkn") })
        .then((res) => {
          if (res.data.success) {
            setCodeTime(60);
            setSend(!send);
          } else {
            alert(res.data.message);
          }
        });
    }
  };
  return (
    <div className="sendcode">
      {loading ? (
        <div className="loading">
          <div className="loadingbox">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Loading...
          </div>
        </div>
      ) : (
        <div className="sendcodewrapper">
          <h2>Your Verification Code Has Been Send To Email ,{info}</h2>
          {codeTime > 0 && (
            <h4>You Can Resend Code After {codeTime} Seconds </h4>
          )}
          <div
            className="btnresend"
            style={{
              backgroundColor: codeTime > 0 ? "rgb(198, 206, 198)" : "rgb(82, 82, 82)",
              color: "white",
              cursor: codeTime > 0 ? "not-allowed" : "pointer",
            }}
            onClick={handleResend}
          >
            Resend Mail
          </div>
        </div>
      )}
    </div>
  );
}

export default SendCode;
