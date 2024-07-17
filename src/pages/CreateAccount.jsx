import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleRight,
  faCheck,
  faCopy,
  faEye,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BaseUrl } from "../config";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [notification, setNotification] = useState({
    type: undefined,
    msg: undefined,
  });
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [Loading, setLoding] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const Copied = () => {
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };

  const Erroring = (type, message) => {
    setNotification({
      type: type,
      msg: message,
    });
  };

  const OffNotification = () => {
    setNotification({
      type: undefined,
      msg: undefined,
    });
  };
  const generateID = () => {
    let ids = Math.floor(Math.random() * 1000000000);
    if (ids.toString().length === 9) {
      setId(ids);
    } else {
      generateID();
    }
  };
  const CopyID = () => {
    navigator.clipboard.writeText(id);
    Copied();
  };

  useEffect(() => {
    generateID();
    if (Cookie.get("tkn")) {
      axios
        .post(`${BaseUrl}/getInfo`, { token: Cookie.get("tkn") })
        .then((res) => {
          if (res.data.success) {
            if (res.data.data.verified) {
              navigate("/Home");
            } else {
              Cookie.remove("tkn");
              navigate("/Login");
            }
          } else {
            Cookie.remove("tkn");
            navigate("/login");
          }
        });
    }
  }, []);

  const handleCreateAccount = () => {
    if (name === "" || email === "" || password === "") {
      Erroring("error", "Please fill all the fields");
    } else {
      const data = {
        username: name,
        email: email,
        password: password,
        id: id,
      };
      axios
        .post(`${BaseUrl}/createaccount`, data)
        .then((res) => {
          if (res.data.success) {
            setLoding(true);
            Cookie.set("tkn", res.data.token , {expires : 30 , secure : false});
            setTimeout(() => {
              navigate("/SendMail");
              setLoding(false);
            }, 2000);
          } else {
            Erroring("error", res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className={window.innerHeight > 400 ? "main center" : "main"}>
      {Loading && (
        <div className="loading">
          <div className="loadingbox">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Loading...
          </div>
        </div>
      )}
      {notification.type !== undefined && (
        <div
          className="notification"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            backgroundColor:
              notification.type === "error" ? "darkslategrey" : "darkslategrey",
          }}
        >
          <div
            className="notification-type"
            style={{
              color: notification.type === "error" ? "black" : "grey",
            }}
          >
            {notification.type === "error" ? "ERROR" : "SUCCESS"}
            <div
              className="cancel"
              onClick={() => {
                OffNotification();
              }}
            >
              <span></span>
              <span></span>
            </div>
          </div>
          <div
            className="notification-msg"
            style={{
              color: notification.type === "error" ? "black" : "aqua",
            }}
          >
            {notification.msg}
          </div>
        </div>
      )}

      <div
        className={
          window.innerHeight > 400
            ? "createAccount-form"
            : "createAccount-form h-cr-form"
        }
      >
        <h2>Create Account</h2>
        <div className="form">
          <input
            className="name"
            value={name}
            id="name"
            onChange={(e) => {
              setName(e.target.value);
              setNotification({ type: undefined, msg: undefined });
            }}
            placeholder="Enter Your Name"
            type="text"
          />
          <input
            className="email"
            type="text"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setNotification({ type: undefined, msg: undefined });
            }}
            value={email}
            placeholder="Enter Your Email"
          />
          <div className="passwordcon">
            <input
              className="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setNotification({ type: undefined, msg: undefined });
              }}
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
              id="password"
              autoComplete="off"
            />
            <div className="eye" onClick={() => setShowPass(!showPass)}>
              {showPass && <div className="cut"></div>}
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
          <div className="id">
            <div className="disabled"></div>
            <span>{id}</span>
            <div className="copyid" title="Copy ID" onClick={CopyID}>
              {isCopy ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faCopy} />
              )}
            </div>
            <div className="refresh" title="Refresh ID" onClick={generateID}>
              <FontAwesomeIcon icon={faRefresh} />
            </div>
          </div>
        </div>
        <div className="btncontainer">
          <div className="btn-c-a" onClick={handleCreateAccount}>
            Create Account <FontAwesomeIcon icon={faArrowCircleRight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
