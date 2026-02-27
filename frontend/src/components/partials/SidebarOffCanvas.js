import './SidebarOffCanvas.css'
import CloseIcon from '@mui/icons-material/Close'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import { Avatar } from "@mui/material"
import { useState, useEffect } from "react"
import BASE_URL from "../../utils/auth"

const SidebarOffCanvas = ({
  editProfile,
  editProfileImage,
  isOpen,
  handleOffCanvas,
  profile,
  show
}) => {

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    if (profile) {
      setName(profile.username || "")
      setBio(profile.bio || "")
    }
  }, [profile])

  // ==========================
  // Submit Profile Update
  // ==========================
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!editProfile) return
    editProfile({ name, bio })
  }

  // ==========================
  // Upload Image
  // ==========================
  const handleImageUpload = (file) => {
    if (!file || !editProfileImage) return
    editProfileImage(file)
  }

  return (
    <div className={`sidebaroffcanvas__container ${isOpen}`}>
      <div className="offcanvas__content">

        <div className="sidebaroffcanvas__header">
          <h2>Profile</h2>
          <CloseIcon
            onClick={() => handleOffCanvas('')}
            className="sidebaroffcanvas__close"
          />
        </div>

        <div className="sidebaroffcanvas__subcontent">

          {/* Avatar Section */}
          <div className='sidebaroffcanvas__avatar__wrapper'>
            <Avatar
              style={{ width: '150px', height: '150px', margin: '0px auto' }}
              src={
                profile?.image
                  ? `${BASE_URL}${profile.image}`
                  : ""
              }
            />

            <PhotoCameraOutlinedIcon className='upload__icon' />

            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={e => handleImageUpload(e.target.files[0])}
              title=""
            />
          </div>

          {/* Success Message */}
          <div className={`sidebaroffcanvas__message ${show}`}>
            <p>Profile Updated Successfully!</p>
          </div>

          {/* Form */}
          <form
            className="sidebaroffcanvas__form"
            onSubmit={handleSubmit}
          >
            <label>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <label>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
            ></textarea>

            <button type="submit">Save</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default SidebarOffCanvas