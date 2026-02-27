import './Sidebar.css'
import { Avatar, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChatCard from './ChatCard'
import { useEffect, useState } from 'react'
import Popup from "reactjs-popup"
import { Link, } from 'react-router-dom'
import SidebarOffCanvas from './SidebarOffCanvas'

import {
  fetchContacts,
  searchContacts,
  addContact,
  checkUser
} from "../../api/contactService"

import { apiClient } from "../../api/apiClient"
import { clearAuth, getRefreshToken } from "../../utils/auth"

const Sidebar = ({ setIsLoggedIn }) => {

  const [search, setSearch] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [contacts, setContacts] = useState([])
  const [profile, setProfile] = useState(null)
  const [offCanvasIsOpen, setOffCanvasIsOpen] = useState('')
  const [showMessage, setShowMessage] = useState('')
  const [userExist, setUserExist] = useState(null)
  const [canAdd, setCanAdd] = useState(false)



  const openOffCanvas = (status) => {
    setOffCanvasIsOpen(status)
  }

  // ==============================
  // Load Profile + Contacts
  // ==============================
  useEffect(() => {
    apiClient("/api/profile/").then(setProfile)
    fetchContacts().then(setContacts)
  }, [])

  // ==============================
  // Search Contacts
  // ==============================
  const handleSearch = (value) => {
    setSearch(value)

    if (!value.trim()) {
      fetchContacts().then(setContacts)
    } else {
      searchContacts(value).then(setContacts)
    }
  }

  // ==============================
  // Verify Phone Number
  // ==============================
  const handleCheckUser = async (value) => {
    setPhoneNumber(value)

    if (!value) {
      setUserExist(null)
      setCanAdd(false)
      return
    }

    const data = await checkUser(value)
    setUserExist(data.message)
    setCanAdd(data.can_add)
  }

  // ==============================
  // Add Contact
  // ==============================
  const handleAddContact = async (e) => {
    e.preventDefault()

    const newContact = await addContact({
      phoneNumber,
      displayName
    })

    setContacts(prev => [newContact, ...prev])
    setPhoneNumber('')
    setDisplayName('')
    setUserExist(null)
    setCanAdd(false)
  }

const editProfile = async (data) => {
  const updatedProfile = await apiClient("/api/edit-profile/", {
    method: "PATCH",
    body: JSON.stringify(data)
  })

  setProfile(updatedProfile)

  // Show success message
  setShowMessage("true")

  setTimeout(() => {
    setShowMessage("")
  }, 1500)
}


const editProfileImage = async (image) => {
  const formData = new FormData()
  formData.append("image", image)

  const updatedProfile = await apiClient("/api/edit-profile/", {
    method: "PATCH",
    headers: {}, // important: don't override multipart header
    body: formData
  })

  setProfile(updatedProfile)

  setShowMessage("true")

  setTimeout(() => {
    setShowMessage("")
  }, 1500)
}

  // ==============================
  // Logout
  // ==============================
  const handleLogout = async () => {
  try {
    await apiClient("/api/logout/", {
      method: "POST",
      body: JSON.stringify({
        refresh: getRefreshToken()
      })
    })
  } catch (err) {
    console.log(err)
  }

  clearAuth()

  // Hard redirect (forces full cleanup)
  window.location.href = "/login"
}

  return (
    <div className="sidebar__container">

      {profile && (
  <SidebarOffCanvas
    isOpen={offCanvasIsOpen}
    handleOffCanvas={openOffCanvas}
    profile={profile}
    editProfile={editProfile}
    editProfileImage={editProfileImage}
    show={showMessage}
  />
)}

      {/* ================= Top Section ================= */}
      <div className="sidebar__usersection">
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => openOffCanvas('sidebaroffcanvas__active')}
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

          {/* ================= Add Contact ================= */}
          <IconButton>
            <Popup trigger={<AddIcon />} modal>
              <div className="modal">
                <h2 className="header" style={{ textAlign: "center" }}>
                  Add Contact
                </h2>

                <div className="content">
                  <form onSubmit={handleAddContact}>
                    <div className="auth__form__container">
                      <label>Phone Number</label>
                      <input
                        type="number"
                        value={phoneNumber}
                        className="auth__form__input"
                        onChange={e => handleCheckUser(e.target.value)}
                      />

                      {userExist && (
                        <div style={{ color: "red" }}>
                          <small>▪ {userExist}</small>
                        </div>
                      )}
                    </div>

                    <div className="auth__form__container">
                      <label>Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        className="auth__form__input"
                        onChange={e => setDisplayName(e.target.value)}
                      />
                    </div>

                    <button
                      className={`add__btn ${!canAdd ? 'btn__disabled' : ''}`}
                      type="submit"
                      disabled={!canAdd}
                    >
                      <AddIcon />
                    </button>
                  </form>
                </div>
              </div>
            </Popup>
          </IconButton>

          {/* ================= Logout ================= */}
          <IconButton>
            <Popup
              trigger={<MoreHorizIcon />}
              position="right top"
              on="click"
              arrow={false}
            >
              <div className="menu">
                <div className="menu-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            </Popup>
          </IconButton>
        </div>
      </div>

      {/* ================= Search ================= */}
      <div style={{ borderBottom: '0.1px solid #eee' }}>
        <div className="sidebar__searchcontainer">
          {search ? <ArrowBackIcon /> : <SearchIcon />}
          <input
            className="sidebar__searchinput"
            placeholder="Search or start new chat"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= Contact List ================= */}
      <div className="sidebar__contact__list">
        {contacts.length ? (
          <ChatCard contacts={contacts} />
        ) : (
          <div className='sidebar__nocontact'>
            <p>No Contact Found!</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Sidebar