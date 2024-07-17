import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faEye, faGlasses } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";
import { BaseUrl } from "../config";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    type: undefined,
    msg: undefined,
  });
  const [showPass, setShowPass] = useState(false);
  const [Loading, setLoding] = useState(false);
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
  const HandleLogin = () => {
    axios.post(`${BaseUrl}/Login` ,  {
      emailorid : email,
      password : password
    }).then((res) => {
      if (res.data.success) {
        Cookie.set("tkn", res.data.token , {expires : 30 , secure : false});
        window.location.reload();
      } else {
        if(res.data.message === 'Please Verify Your Account'){
          Cookie.set("tkn", res.data.token , {expires : 30 , secure : false});
          navigate('/SendMail')
        }else{
          Erroring("error", res.data.message);
        }
      }
    })
  };
  useEffect(() => {
    if (Cookie.get("tkn")) {
      axios
        .post(`${BaseUrl}/getInfo`, { token: Cookie.get("tkn") })
        .then((res) => {
          if (res.data.success) {
            if (res.data.data.verified) {
              navigate("/Home");
            } else {
              Cookie.remove("tkn");
            }
          } else {
            Cookie.remove("tkn");
          }
        });
    }
    setLoding(false)
  }, [navigate]);
  return (
    <div className={window.innerHeight > 350 ? "main center" : "main"}>
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
          window.innerHeight > 350
            ? "createAccount-form"
            : "createAccount-form h-cr-form"
        }
      >
        <h2>Login</h2>
        <div className="form">
          <input
            className="name"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setNotification({
              type: undefined,
              msg: undefined,
            }) }}
            placeholder="Email or ID"
            type="text"
            id="email"
          />
          <div className="passwordcon">
            <input
              className="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setNotification({
                type: undefined,
                msg: undefined,
              }) }}
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
              id="pass"
              autoComplete="off"
            />
            <div className="eye" onClick={() => setShowPass(!showPass)}>
              {showPass && <div className="cut"></div>}
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
          <div className="forgetpass">
            <span>Forget Password?</span>
          </div>
        </div>

        <div className="btncontainer">
          <div className="btn-c-a" onClick={HandleLogin}>
            Login <FontAwesomeIcon icon={faArrowCircleRight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
