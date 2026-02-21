import './Sidebar.css'
import { Avatar, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatCard from './ChatCard'
import { useEffect, useState } from 'react'
import Popup from "reactjs-popup";
import {Link} from 'react-router-dom'
import SidebarOffCanvas from './SidebarOffCanvas';
import { useNavigate } from 'react-router-dom';
import {getToken } from '../../utils'


const Sidebar = () => {
  const [search, setSearch] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [contacts, setContacts] = useState(null)
  const [ profile, setProfile ] = useState(null)
  const [offCanvasIsOpen, setOffCanvasIsOpen] = useState('')
  const [showMessage, setShowMessage] = useState('')
  const [userExist, setUserExist] = useState(null)
  const [disableAdd, setDisableAdd] = useState(false)
  const navigate = useNavigate()

  const OpenOffCanvas = (status) => {
    setOffCanvasIsOpen(status)
  }
  
  const handleSearch = (value) => {
    setSearch(value)
    fetch('http://127.0.0.1:8000/api/contacts?q='+value, {
      headers : {
        'Authorization' : `Token ${getToken()}`
      },
    })
      .then(response => response.json())
      .then(data => {
        setContacts(data)
      })
      .catch(err => {
        if(err.name !== "AbortError"){
          console.dir(err)
        }
      })
  }
  const verifyPhoneNumber = (value) => {
    setPhoneNumber(value)
    fetch(`http://127.0.0.1:8000/api/check-user/?q=${value}`, {
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${getToken()}`
          },
      })
      .then(res => res.json())
      .then(data => {
        setUserExist(data.message)
        setDisableAdd(data.can_add)
      })
      .catch(err => {
          if(err.name !== 'AbortError'){
              console.log(err)
          }
      })
  }
  const addContact = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/contacts/`, {
          method : 'POST',
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${getToken()}`
          },
          body: JSON.stringify({phoneNumber, displayName})
      })
      .then(res => res.json())
      .then(data => {
        setContacts([data, ...contacts])
        setPhoneNumber('')
        setDisplayName('')
        setUserExist(null)
        setDisableAdd(false)
      })
      .catch(err => {
          if(err.name !== 'AbortError'){
              console.log(err)
          }
      })
  }
  const handleLogout = () => {
    localStorage.clear('token')
    window.location.reload()
  }
  
  const editProfile = data => {
      fetch(`http://127.0.0.1:8000/api/edit-profile/`, {
          method : 'PATCH',
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${getToken()}`
          },
          body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
        setShowMessage(true)
        setTimeout(()=> setShowMessage(''), 1500)
      })
      .catch(err => {
          if(err.name !== 'AbortError'){
              console.log(err)
          }
      })
  }

  const editProfileImage = (image) => {
  const formData = new FormData();
  formData.append("image", image);

  fetch(`http://127.0.0.1:8000/api/edit-profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${getToken()}`
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      setProfile(data);
      setShowMessage(true);
      setTimeout(() => setShowMessage(""), 1500);
    })
    .catch(err => console.log(err));
};



  useEffect(() => {
    const AbortCont = new AbortController()
    fetch(`http://127.0.0.1:8000/api/profile/`,{
            signal : AbortCont.signal, 
            headers : {
                'Authorization' : `Token ${getToken()}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setProfile(data)
        })
        .catch(err => {
            if(err.name !== 'AbortError'){
                console.log(err);
            }
    })
    fetch('http://127.0.0.1:8000/api/contacts/', {
      signal : AbortCont.signal,
      headers : {
        'Authorization' : `Token ${getToken()}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setContacts(data)
      })
      .catch(err => {
        if(err.name !== "AbortError"){
          console.dir(err)
        }
      })
    return () => AbortCont.abort();
  }, [])
  return (
    <div className="sidebar__container">
      {profile ? (
        <SidebarOffCanvas isOpen={offCanvasIsOpen} handleOffCanvas={OpenOffCanvas} 
        profile={profile} editProfile={editProfile} show={showMessage} editProfileImage={editProfileImage}/>
      ) : ''}

      <div className="sidebar__usersection">
  <div
    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    onClick={() => OpenOffCanvas('sidebaroffcanvas__active')}
  >
    <Avatar
  src={
    profile?.image
      ? `http://127.0.0.1:8000${profile.image}`
      : ""
  }
/>
    <span style={{ marginLeft: "10px", fontWeight: "500" }}>
      {profile?.username}
    </span>
  </div>

  <div>

          <Link to="/">
          <IconButton>
            <AutorenewIcon />
          </IconButton>
          </Link>
          <IconButton>
            <Popup trigger={<AddIcon />} modal>
              {(close) => (
                <div className="modal">
                  {/* <button className="close" onClick={close}>
                    &times;
                  </button> */}
                  <h2 className="header" style={{ textAlign: "center" }}>
                    Add Contact
                  </h2>
                  <div className="content">
                    <form onSubmit={addContact}>
                      <div className="auth__form__container">
                        <label>Phone Number</label>
                        <input
                          placeholder="Phone Number"
                          type="number"
                          value={phoneNumber}
                          className = "auth__form__input"
                          onChange={e => verifyPhoneNumber(e.target.value)}
                          
                        />
                        {userExist ? (
                        <div style={{color : 'red'}}>
                          <small>▪ {userExist}</small>
                        </div>
                        ) : ''}
                        
                        {/* <span></span> */}
                      </div>
                      <div className="auth__form__container">
                        <label>Display Name</label>
                        <input
                          placeholder="Display Name"
                          type="text"
                          value={displayName}
                          className = "auth__form__input"
                          onChange={e => setDisplayName(e.target.value)}
                          
                        />
                        
                      </div>
                      <button className={`add__btn ${!disableAdd ? 'btn__disabled' : ''}`} type="submit" disabled={!disableAdd}><AddIcon /></button>
                    </form>
                  </div>
                </div>
              )}
            </Popup>
          </IconButton>
          <IconButton>
            <Popup
              trigger={<MoreHorizIcon />}
              position="right top"
              on="click"
              closeOnDocumentClick
              mouseLeaveDelay={300}
              mouseEnterDelay={0}
              contentStyle={{ padding: '0px', border: 'none' }}
              arrow={false}
            >
              <div className="menu">
                <div className="menu-item" onClick={handleLogout}> Logout</div>
              </div>
            </Popup>
          </IconButton>
        </div>
      </div>
      <div style={{borderBottom : '0.1px solid #eee'}}>
      <div className="sidebar__searchcontainer">
          {search ? <ArrowBackIcon /> :<SearchIcon />}
          <input className="sidebar__searchinput" placeholder="Search or start new chat"  value={search} onChange={e => handleSearch(e.target.value)}/>
      </div>
      </div>
      <div className="sidebar__contact__list">
        {contacts && contacts.length ? (
          <ChatCard contacts={contacts}/>
        ) : 
          <div className='sidebar__nocontact'>
            <p>No Contact Found!</p>
          </div>
        }
      </div>
      
    </div>
  );
};



export default Sidebar;
