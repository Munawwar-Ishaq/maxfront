import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../config";
import Cookie from "js-cookie";
function AccountVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [displayBtn, setDisplayBtn] = useState(false);
  const [msg, setmsg] = useState(
    "Please Wait Your Account Account Has Been Verifying"
  );
  const VerifyAccount = () => {
    axios
      .post(`${BaseUrl}/verifyaccount/${token}`)
      .then((res) => {
        if (res.data.success) {
          setDisplayBtn(true);
          Cookie.set("tkn", res.data.token , {expires : 30 , secure : false});
          setmsg("Your Account Has Been Verified Successfully");
          setTimeout(() => {
            navigate("/Home");
          }, 3000);
        } else {
          if (res.data.message === "Account Already Verified") {
            setmsg("Account Already Verified");
            setTimeout(() => {
              Cookie.remove("tkn");
              navigate("/Login");
            }, 2000);
          } else {
            setTimeout(() => {
              Cookie.remove("tkn");
              navigate("/Login");
            }, 2000);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    VerifyAccount();
  }, [VerifyAccount , navigate]);
  return (
    <div className="va">
      <div className="wrapp">
        <h2>{msg}</h2>
        {displayBtn && (
          <button onClick={() => navigate("/Home")}>GO To Home</button>
        )}
      </div>
    </div>
  );
}

export default AccountVerification;
