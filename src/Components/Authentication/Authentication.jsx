import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthUtility from "./AuthUtility";
import PreLoader from '../utilities/PreLoader';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import "./Authentication.css";
import { nContext } from "../ContextApi/NotificationContext";
import { socketContextProvider } from "../ContextApi/SocketContext";
const Regex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
function Authentication() {
  const { socket } = useContext(socketContextProvider);
  const { notify } = useContext(nContext);
  var location = useLocation();
  const m = (location.state && location.state.m2) || "";
  const [changeAuth, setChangeAuth] = useState(true);
  const [loader, setLoader] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();
  var [authInfo, setAuthInfo] = useState({
    name: "",
    email: "",
    password: "",
    phNumber: null,
    address: "",
    profileUrl: "",
    confirm: ""
  });
  function changeInput(event) {
    try {
      if (event) {
        if (event.target) {
          const { name, value } = event.target;
          if (name === "image") {
            setSpinner(true)
            const pic = event.target.files[0];
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "ecommerce");
            data.append("cloud_name", "dlyhm4e8q");
            fetch(`${process.env.REACT_APP_CLOUDINARY_KEY}`, {
              method: "post",
              body: data,
            }).then((res) => res.json()).then((data) => {
              setAuthInfo((prevValue) => {
                return { ...prevValue, profileUrl: data.url.toString() };
              });
              setSpinner(false);
            }).catch((err) => {
              setSpinner(false);
              notify(err);
            });
          } else {
            setAuthInfo((prevValue) => {
              return { ...prevValue, [name]: value };
            });
          }
        } else {
          setAuthInfo((prevValue) => {
            return { ...prevValue, phNumber: event };
          });
        }
      }
    }
    catch (err) {
      notify(err.message);
    }
  }
  async function makeAuthenticate(event) {
    event.preventDefault();
    var route;
    var passwordValidation = true;
    !changeAuth ? (route = "/auth/register") : (route = "/auth/login");
    var passwordConfimation = true;
    if (route === "/auth/register") {
      passwordValidation = Regex.test(authInfo.password);
      passwordConfimation = authInfo.password === authInfo.confirm;
    }
    if (!passwordConfimation) {
      notify("Passwords do not match.Please ensure they are the same.");
    }
    else if (!passwordValidation) {
      notify("Password must contain atleast one Special,Lowercase,Uppercase and Number");
    }
    else {
      setLoader(true);
      try {
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL + route,
          { authInfo },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.data;
        setLoader(false);
        if (data.user) {
          const user = data.user;
          socket.emit('join-socket-connection', authInfo.email);
          localStorage.setItem("token", user);
          navigate("/");
        } else if (data.status !== false) {
          setChangeAuth(!changeAuth);
        }
        notify(data.message);
      } catch (err) {
        notify(err.message);
      }
    }
  }
  useEffect(() => {
    if (m) {
      notify(m);
    }
  }, [m]);
  return (
    <div id="authentication-section">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} theme="dark" />
      <React.Fragment>
        <div>
          {
            loader ? <PreLoader /> :
              changeAuth ? (
                <div>
                  <AuthUtility
                    functionality={makeAuthenticate}
                    change={changeInput}
                    changeAuth={() => {
                      setChangeAuth(!changeAuth);
                    }}
                    type="LOGIN"
                    loader={loader}
                    to="Register"
                    title="Login"
                  />
                </div>
              ) : (
                <AuthUtility
                  functionality={makeAuthenticate}
                  change={changeInput}
                  changeAuth={() => {
                    setChangeAuth(!changeAuth);
                  }}
                  type="REGISTER"
                  loader={loader}
                  spinner={spinner}
                  to="Login"
                  title="Register"
                />
              )}
        </div>
      </React.Fragment>
    </div>
  );
}

export default Authentication;
