import React , {useEffect} from 'react';
import axios from 'axios';
import Cookie from 'js-cookie'
import { BaseUrl } from "../config";
import { useNavigate } from 'react-router-dom';

function Loading() {
  const navigate = useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      if (Cookie.get("tkn")) {
        axios
          .post(`${BaseUrl}/getInfo`, { token : Cookie.get("tkn")})
          .then((res) => {
            if (res.data.success) {
              if (res.data.data.verified){
                navigate("/Home");
              } else {
              Cookie.remove('tkn');
                navigate("/Login");
              }
            } else {
              Cookie.remove('tkn');
              navigate("/Login");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        navigate("/CreateAccount");
      }
    }, 3000);
  } ,[navigate])
  return (
    <div className="whatsapp-loader-container">
      <div className="whatsapp-loader">
        <div className="whatsapp-loader-inner"></div>
      </div>
    </div>
  )
}

export default Loading