import {
  faAnchor,
  faArrowRightFromBracket,
  faBarsStaggered,
  faCog,
  faEdit,
  faPhone,
  faSearch,
  faTrash,
  faVideoCamera,
  faPaperPlane,
  faPaperclip,
  faMicrophone,
  faPlusSquare,
  faUserAltSlash,
  faCommentDots,
  faAngleRight,
  faPlus,
  faArrowLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons/faCheckDouble";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "../config";
function Home() {
  const [userinfo, setUserInfo] = useState({});
  const [userChat, setUserChat] = useState([]);
  const [showmenu, setShowMenu] = useState(false);
  const [showNewContactMenu, setShowNewContactMenu] = useState(false);
  const [loadingChatContainer, setLoadingChatContainer] = useState(false);
  const [showcancel, setShowCancel] = useState(false);
  const [showdelete, setShowDelete] = useState(false);
  const [activecircleplus, setActivecircleplus] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const [pinMenu, setPinMenu] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [addcontactloading, setaddContactLoading] = useState(false);
  const [barMenu, setBarMenu] = useState(false);
  const [chatmsg, setchatmsg] = useState("");
  const navigate = useNavigate();
  const [Loading, setLoding] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [activeTab, setActiveTab] = useState("Display");
  const [contacterrormsg, setcontacterrormsg] = useState("");
  const [addContactData, setAddContactData] = useState({
    ContactName: "",
    ContactID: "",
  });
  const [activeContact, setActiveContact] = useState({
    name: "",
    id: "",
    profile: "",
  });
  const [notificationMessage, setNotificationMessage] = useState([]);
  const activeContactRef = useRef({});
  const userInfoRef = useRef({});
  const [activeUserData, setActiveUserData] = useState({});
  const [displayContact, setDisplayContact] = useState([]);
  const [allContact, setAllContact] = useState([]);
  const [allChat, setAllChat] = useState([]);
  const allChatRef = useRef([]);
  const userChatRef = useRef([]);
  let messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeContact.id !== "") {
      scrollToBottom();
    }
  }, [activeContact.id, userChat]);

  useEffect(() => {
    if (activeContact.id !== "") {
      Socket.emit("msgSeen", { id: activeContact.id });
    }
  }, [activeContact.id]);

  useEffect(() => {
    userChatRef.current = userChat;
  }, [userChat]);

  useEffect(() => {
    allChatRef.current = allChat;
  }, [allChat]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  const contactToDisaplay = (allcon) => {
    setDisplayContact(allcon.filter((item) => item.isDisplay === 1));
  };

  const handleLogout = () => {
    setLoding(true);
    setTimeout(() => {
      setLoding(false);
      Cookie.remove("tkn");
      Socket.disconnect();
      navigate("/Login");
    }, 2000);
  };

  useEffect(() => {
    setLoadingChatContainer(false);
    setShowCancel(false)
    setShowDelete(false);
    setNotificationMessage([]);
    Socket.connect();
    setTimeout(() => {
      setIsFetching(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const OnineUser = (e_data) => {
      Socket.emit("onlineUser", e_data);
    };

    const userInfo = (e_data) => {
      setUserInfo(e_data);
      setMainLoading(false);
    };

    const OfflineUser = (e_data) => {
      Socket.emit("offlineUser", e_data);
    };

    const AllContact = (e_data) => {
      if (activeContactRef.current.id !== "") {
        let findind = e_data.row.findIndex(
          (data) => data.ContactID === parseInt(activeContactRef.current.id)
        );
        if (findind.length !== -1) {
          setActiveUserData({ Online: e_data.row[findind].IsOnline });
        }
      }
      setAllContact(e_data.row);

      contactToDisaplay(e_data.row);
    };

    const AllChats = (e_data) => {
      setAllChat(e_data.row);
      setMainLoading(false);
      if (activeContactRef.current.id) {
        let finduserchat = e_data.row.filter(
          (data) =>
            data.ReceiverID === parseInt(activeContactRef.current.id) ||
            data.SenderID === parseInt(activeContactRef.current.id)
        );
        setUserChat(finduserchat);
      }
    };

    const Success = (e_data) => {
      if (e_data.action === "add contact") {
        let getcontact = [];
        getcontact = allContact;
        getcontact.push(e_data.data);
        setAllContact(getcontact);
        setaddContactLoading(false);
        setShowNewContactMenu(false);
        setAddContactData({
          ContactName: "",
          ContactID: "",
        });
      }
    };

    const OpponentSaveYou = (e_data) => {
      Socket.emit("OpponentSaveMeUpdateImageData", e_data);
    };

    const SendMeMsg = (e_data) => {
      console.log(e_data);
      if(activeContactRef.current.id !== ''){
        if(parseInt(activeContactRef.current.id) === e_data.SenderID){
          console.log('yes i see thihs user msg ');
          Socket.emit("IReceivedMsg", { ...e_data , action: 's'});
        }
      }else{
        Socket.emit("IReceivedMsg", { ...e_data , action : 'r'});
      }
    };

    const ReceivedMsg = (e_data) => {
      Socket.emit('UpdateMsgReceived' , {id : e_data.id , action : e_data.action });
    };

    const msgNotification = (e_data) => {
      if (activeContact.id !== "") {
        if (e_data.row.SenderID === parseInt(activeContactRef.current.id)) {
          Socket.emit("msgSeen", { id: activeContactRef.current.id });
        }
      }
      // let findind = allContact.filter(data => data.id === e_data.row.SenderID);
      // let notification = {
      //   name :  allContact[findind],
      //   message : e_data.row.Message
      // }
      // let msgarr = notificationMessage;
      // setNotificationMessage(msgarr.push(notification));
    };

    // Cleanup function
    Socket.on("OnineUser", OnineUser);
    Socket.on("OfflineUser", OfflineUser);
    Socket.on("user-info", userInfo);
    Socket.on("all contact", AllContact);
    Socket.on("all chats", AllChats);
    Socket.on("success", Success);
    Socket.on("OpponentSaveYou", OpponentSaveYou);
    Socket.on("SendMeMsg", SendMeMsg);
    Socket.on("ReceivedMsg", ReceivedMsg);
    Socket.on("msgNotification", msgNotification);

    return () => {
      Socket.off("OnineUser", OnineUser);
      Socket.off("OfflineUser", OfflineUser);
      Socket.off("user-info", userInfo);
      Socket.off("all contact", AllContact);
      Socket.off("all chats", AllChats);
      Socket.off("success", Success);
      Socket.off("OpponentSaveYou", OpponentSaveYou);
      Socket.off("SendMeMsg", SendMeMsg);
      Socket.off("ReceivedMsg", ReceivedMsg);
      Socket.off("msgNotification", msgNotification);

      Socket.disconnect();
    };
  }, []);

  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  useEffect(() => {
    userInfoRef.current = userinfo;
  }, [userinfo]);

  const handleChangeAddContact = (e) => {
    setcontacterrormsg("");
    setAddContactData({ ...addContactData, [e.target.name]: e.target.value });
    if (addContactData.ContactName.length > 0) {
      if (addContactData.ContactID.length > 7) {
        setShowAddBtn(true);
      } else {
        setShowAddBtn(false);
      }
    } else {
      setShowAddBtn(false);
    }
  };

  const handleAddContact = () => {
    if (showAddBtn) {
      let data = {
        token: Cookie.get("tkn"),
        contactName: addContactData.ContactName,
        contactID: addContactData.ContactID,
      };
      Socket.emit("addContact", data);
      setaddContactLoading(true);
    }
  };

  const GET_TIME = () => {
    let date = new Date();
    let hr = date.getHours();
    let minute = date.getMinutes();
    let timeType = "AM";
    if (hr > 12) {
      hr = hr - 12;
      timeType = "PM";
      if (minute > 12) {
        minute = minute - 12;
      } else if (minute < 10) {
        minute = "0" + minute;
      }
    } else if (hr < 10) {
      hr = "0" + hr;
    }

    let Time = hr + ":" + minute + " " + timeType;

    return Time;
  };

  const handleChatSend = () => {
    let randomkey = Date.now() + "-" + Math.floor(Math.random() * 99999999999);

    let data = {
      UserID: userinfo.id,
      SenderID: userinfo.id,
      ReceiverID: activeContact.id,
      Message: chatmsg,
      MsgType: "text",
      Audio: "",
      Picture: "",
      ChatID: randomkey,
      Time: GET_TIME(),
      IsReceived: 0,
      IsSeen: 0,
    };

    Socket.emit(`chat`, data);

    let getAllchat = allChat;
    getAllchat.push(data);
    setAllChat(getAllchat);
    let getUserChat = userChat;
    getUserChat.push(data);
    setUserChat(getUserChat);
    setTimeout(() => {
      scrollToBottom();
    }, 50);
    setchatmsg("");
  };

  const handleNewContact = () => {
    setShowNewContactMenu(true);
    setShowAddBtn(false);
    setAddContactData({
      ContactName: "",
      ContactID: activeContact.id,
    });
  };

  return (
    <>
      {mainLoading ? (
        <div className="mainLoading">
          <img
            className={isFetching ? "opacity-up-down" : ""}
            src={require("../images/logo.png")}
            alt="pic"
          />
          <div className="line-loading">
            <div className="line"></div>
          </div>
        </div>
      ) : (
        <div className="main-home">
          {notificationMessage && notificationMessage.length > 0 ? (
            <>
              <div className="msgnotificationcontainer">
                {notificationMessage.map((item) => {
                  return (
                    <div className="msglist">
                      <div className="sendername">{item.name}</div>
                      <div className="sendermsg">{item.message}</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
          {showNewContactMenu && (
            <>
              <div
                className="contactaddloading"
                style={{
                  display: addcontactloading ? "flex" : "none",
                }}
              >
                <h3>Please Wait Adding Contact...</h3>
                <div className="loadingbowl">
                  <div className="col-3">
                    <div className="snippet" data-title="dot-spin">
                      <div className="stage">
                        <div className="dot-spin"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="newcontactmain"
                onClick={() => setShowNewContactMenu(false)}
              >
                <div
                  className="newcontactcontainer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2>Add New Contact</h2>
                  {contacterrormsg && (
                    <span className="errormsg">{contacterrormsg}</span>
                  )}
                  <div className="contatfield">
                    <div>Contact Name</div>
                    <input
                      type="text"
                      autoComplete="off"
                      autoFocus
                      name="ContactName"
                      value={addContactData.ContactName}
                      onChange={handleChangeAddContact}
                    />
                  </div>
                  <div className="contatfield">
                    <div>Contact ID</div>
                    <input
                      type="text"
                      autoComplete="off"
                      value={addContactData.ContactID}
                      name="ContactID"
                      onChange={handleChangeAddContact}
                    />
                  </div>
                  <div
                    className="addcontactbtn"
                    style={{
                      backgroundColor: showAddBtn
                        ? "rgb(78, 77, 77)"
                        : "rgb(155, 144, 144)",
                      cursor: showAddBtn ? "pointer" : "not-allowed",
                    }}
                    onClick={handleAddContact}
                  >
                    Add Contact
                  </div>
                </div>
              </div>
            </>
          )}
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
          <div className="sidebar">
            <div className="profile">
              <div className="profile-pic">
                <img src={userinfo.profile} alt="im" />
              </div>
              <div className="profile-right">
                <div className="profile-name">
                  <div className="profile-username">{userinfo.username}</div>
                  <div className="profile-status">ID : {userinfo.id}</div>
                </div>
                <div
                  className="setting-btn"
                  onClick={() => setShowMenu(!showmenu)}
                >
                  <div className="btn-cog">
                    <FontAwesomeIcon icon={faCog} />
                  </div>
                  {showmenu && (
                    <div
                      className="setting-menu"
                      onClick={() => setShowMenu(!showmenu)}
                    >
                      <div
                        className="newcontact"
                        onClick={() => setShowNewContactMenu(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPlusSquare}
                          width={30}
                          style={{ fontSize: "22px" }}
                        />{" "}
                        New Contact
                      </div>
                      <div className="edit-profile-btn">
                        <FontAwesomeIcon
                          icon={faEdit}
                          width={30}
                          style={{ fontSize: "22px" }}
                        />
                        Edit Profile
                      </div>
                      <div className="about">
                        <FontAwesomeIcon
                          icon={faAnchor}
                          width={30}
                          style={{ fontSize: "22px" }}
                        />{" "}
                        About
                      </div>
                      <div className="logout" onClick={handleLogout}>
                        <FontAwesomeIcon
                          icon={faArrowRightFromBracket}
                          width={30}
                          style={{ fontSize: "22px" }}
                        />{" "}
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {activeTab === "Display" && (
              <div
                className="users-tabs"
                style={{
                  height: window.innerHeight - 110 + "px",
                }}
              >
                <div className="headercontact">
                  <div className="headername" style={{ fontSize: 23 }}>
                    Contacts
                  </div>
                  <div
                    className="searchicon"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
                <div className="users-tab-only">
                  {Array.isArray(displayContact) &&
                  displayContact.length > 0 ? (
                    displayContact.map(
                      (item, index) =>
                        item.isDisplay === 1 && (
                          <div
                            className={
                              activeContact.id === item.ContactID
                                ? "user active-user"
                                : "user "
                            }
                            onClick={() => {
                              if (activeContact.id === item.ContactID) {
                                setActiveContact({
                                  id: "",
                                  name: "",
                                  profile: "",
                                });
                                setActiveUserData({});
                              } else {
                                setActiveContact({
                                  name: item.Name,
                                  id: item.ContactID,
                                  profile: item.ProfileImage,
                                });
                                let userchat = [];
                                allChat.forEach((chat) => {
                                  if (
                                    chat.SenderID === userinfo.id &&
                                    chat.ReceiverID === item.ContactID
                                  ) {
                                    userchat.push(chat);
                                  } else if (
                                    chat.SenderID === item.ContactID &&
                                    chat.ReceiverID === userinfo.id
                                  ) {
                                    userchat.push(chat);
                                  }
                                  setUserChat(userchat);
                                });
                              }
                            }}
                            key={index}
                          >
                            <div className="user-logo">
                              <img src={item.ProfileImage} alt="im" />
                            </div>
                            <div className="user-right">
                              <div className="username">
                                <div>
                                  {item.Name.length > 15
                                    ? item.Name.slice(0, 15) + "..."
                                    : item.Name}
                                </div>
                                {item.LastMsg ? (
                                  <div className="last-msg">
                                    {parseInt(item.lastMsgSenderID) ===
                                    userinfo.id
                                      ? "You : " + item.LastMsg.slice(0, 20)
                                      : item.LastMsg.slice(0, 20)}
                                  </div>
                                ) : null}
                              </div>
                              <div className="countmessageandtime">
                                {item.msgCount > 0 && (
                                  <span
                                    className="msgcount"
                                    style={{
                                      width: 25,
                                      height: 25,
                                      fontSize: item.msgCount > 99 ? 13 : 14,
                                    }}
                                  >
                                    {item.msgCount}
                                  </span>
                                )}
                                <span className="msgtime">
                                  {item.LastMsgTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                    )
                  ) : allContact.length > 0 ? (
                    <div className="showonlyicon">
                      <div className="textupper">
                        <h2>Start Chatting</h2>
                        <span>
                          Message privately with Your {allContact.length}{" "}
                          Contacts, no matter what device they use.{" "}
                        </span>
                      </div>
                      <div className="showcontactsprofile">
                        {allContact.map(
                          (item, index) =>
                            index <= 4 && (
                              <div className="iconandname" key={index}>
                                <img src={item.ProfileImage} alt="im" />
                                <span>{item.Name}</span>
                              </div>
                            )
                        )}
                        {allContact.length > 5 && (
                          <div className="viewmorecontact">
                            <div>
                              <FontAwesomeIcon
                                icon={faAngleRight}
                                color="grey"
                                size="1x"
                              />
                            </div>
                            <span>View More</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="nocontact">
                      <FontAwesomeIcon
                        icon={faUserAltSlash}
                        size="4x"
                        color="grey"
                      />
                      <h2>No Contact</h2>
                      <div onClick={() => setShowNewContactMenu(true)}>
                        Click here To Add Contact
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "AllContact" && (
              <div
                className="users-tabs"
                style={{
                  height: window.innerHeight - 110 + "px",
                }}
              >
                <div className="headercontact">
                  <div
                    className="back"
                    onClick={() => {
                      setActiveTab("Display");
                      setActivecircleplus(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="backbtn" />
                  </div>
                  <div className="headername" style={{ fontSize: 23 }}>
                    All Contacts
                  </div>
                  <div
                    className="searchicon"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
                <div className="users-tab-only">
                  {allContact.length > 0 ? (
                    allContact.map((item, index) => (
                      <div
                        className={
                          activeContact.id === item.ContactID
                            ? "user active-user"
                            : "user "
                        }
                        onClick={() => {
                          if (activeContact.id === item.ContactID) {
                            setActiveContact({
                              id: "",
                              name: "",
                            });
                            setActiveUserData({});
                            setUserChat([]);
                          } else {
                            setActiveContact({
                              name: item.Name,
                              id: item.ContactID,
                              profile: item.ProfileImage,
                            });
                            setActiveUserData({ Online: item.IsOnline });
                            let userchat = [];
                            allChat.forEach((chat) => {
                              if (
                                chat.SenderID === userinfo.id &&
                                chat.ReceiverID === item.ContactID
                              ) {
                                userchat.push(chat);
                              } else if (
                                chat.SenderID === item.ContactID &&
                                chat.ReceiverID === userinfo.id
                              ) {
                                userchat.push(chat);
                              }
                              setUserChat(userchat);
                            });
                          }
                        }}
                        key={index}
                      >
                        <div className="user-logo">
                          <img src={item.ProfileImage} alt="im" />
                        </div>
                        <div className="user-right">
                          <div className="username">
                            <div>{item.Name.slice(0, 20)}</div>
                            {item.OpponentSaved === 1 ? (
                              <div className="last-msg">{item.About}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="nocontact">
                      <FontAwesomeIcon
                        icon={faUserAltSlash}
                        size="4x"
                        color="grey"
                      />
                      <h2>No Contact</h2>
                      <div onClick={() => setShowNewContactMenu(true)}>
                        Click here To Add Contact
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="circleplus">
              <div className="circlemain">
                <div
                  className="menus"
                  style={{
                    transform: !activecircleplus ? "scale(0)" : "scale(1)",
                  }}
                >
                  <div
                    className="allcontact"
                    onClick={() => {
                      setActiveTab("AllContact");
                      setActivecircleplus((last) => !last);
                    }}
                  >
                    All Contacts
                  </div>
                  <div
                    className="statutab"
                    onClick={() => {
                      setActiveTab("Status");
                      setActivecircleplus((last) => !last);
                    }}
                  >
                    Status
                  </div>
                </div>
                <div
                  className="plus"
                  onClick={() => {
                    setActivecircleplus((last) => !last);
                  }}
                  style={{
                    transform: activecircleplus
                      ? "rotate(45deg)"
                      : "rotate(0deg)",
                    transition: "all 0.3s",
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </div>
            </div>
          </div>
          <div className="chat-area">
            {activeContact.id === "" ? (
              <div className="nochatarea">
                <FontAwesomeIcon icon={faCommentDots} size="9x" color="grey" />
                <h2>No Chat </h2>
                <div>Click Contact To Start Chat.</div>
                <h3>Welcome To MaxChat App</h3>
              </div>
            ) : (
              <div>
                <div className="chat-header">
                  <div className="chatuser-logo">
                    <img src={activeContact.profile} alt="im" />
                  </div>
                  <div className="chatuser-right">
                    <div className="chatuser-name">
                      <div>{activeContact.name}</div>
                      <div className="chatuser-status">
                        {activeUserData.Online === 1 ? "Online" : "Offline"}
                      </div>
                    </div>
                    <div className="to-right">
                      <div className="options">
                        <div className="videocall">
                          <FontAwesomeIcon icon={faVideoCamera} />
                        </div>
                        <div className="audiocall">
                          <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <div className="pin">
                          <FontAwesomeIcon
                            icon={faPaperclip}
                            className="pinicon"
                            onClick={() => setPinMenu(!pinMenu)}
                          />
                          {pinMenu && (
                            <div
                              className="pin-menu"
                              onClick={() => setPinMenu(!pinMenu)}
                            >
                              <li>Picture</li>
                              <li>record Audio</li>
                            </div>
                          )}
                        </div>
                        {showdelete && (
                          <div className="delete">
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        )}
                        {showcancel && <div className="cancel-sel">Cancel</div>}
                      </div>
                      <div className="optn">
                        <div
                          className="bar"
                          onClick={() => setBarMenu(!barMenu)}
                        >
                          <FontAwesomeIcon icon={faBarsStaggered} />
                        </div>
                        {barMenu && (
                          <div
                            className="baroption"
                            onClick={() => setBarMenu(!barMenu)}
                          >
                            <li onClick={handleNewContact}>New Contact</li>
                            <li>Delete Contact</li>
                            <li>Select</li>
                            <li>Select All</li>
                            <li>Clear All Chat</li>
                            <li>Close Chat</li>
                            <li>Change Wallpaper</li>
                            <li>Change chat Style</li>
                            <li>Block</li>
                            <li>UnBlock</li>
                            <li>Blue Tick Style</li>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {loadingChatContainer ? (
                  <div className="chatloadingContainer">
                    <h1>MaxChat</h1>
                    <span>Loading Chat Please wait...</span>
                  </div>
                ) : (
                  <div className="chats-container" ref={messagesEndRef}>
                    {userChat.map((ch, index) => {
                      if (ch.MsgType === "text") {
                        if (parseInt(ch.SenderID) === userinfo.id) {
                          return (
                            <div className="chat-wrapper" key={index}>
                              <div className="mychat">
                                <div className="msg">{ch.Message}</div>
                                <div className="chat-time">
                                  <span className="time">{ch.Time}</span>
                                  <span>
                                    {ch.IsReceived === 1 ? (
                                      ch.IsSeen === 1 ? (
                                        <FontAwesomeIcon
                                          icon={faCheckDouble}
                                          className="tickread"
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          icon={faCheckDouble}
                                          className="tick"
                                        />
                                      )
                                    ) : (
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="tick"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="chat-wrapper" key={index}>
                              <div className="user-chat">
                                <div className="msg">{ch.Message}</div>
                                <div className="chat-time">{ch.Time}</div>
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                )}

                <div className="typemsg">
                  <input
                    onChange={(e) => setchatmsg(e.target.value)}
                    value={chatmsg}
                    type="text"
                    placeholder="Type Message"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.which === 13) {
                        if (chatmsg) {
                          handleChatSend();
                        }
                      }
                      // console.log(e.key , e.which);
                    }}
                  />
                  {chatmsg.length > 0 ? (
                    <div className="send" onClick={handleChatSend}>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </div>
                  ) : (
                    <div className="audio">
                      <FontAwesomeIcon icon={faMicrophone} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
