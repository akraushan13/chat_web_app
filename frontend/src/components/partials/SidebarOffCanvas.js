import './SidebarOffCanvas.css';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react"

const SidebarOffCanvas = ({editProfile,editProfileImage, isOpen, handleOffCanvas, profile, show}) => {
    const [name, setName] = useState("");
const [bio, setBio] = useState("");

useEffect(() => {
  if (profile) {
    setName(profile.username || "");
    setBio(profile.bio || "");
  }
}, [profile]);



    const handleSubmit = e => {
        e.preventDefault();
        editProfile({name, bio})
    }
    const handleChange = e => {
        editProfileImage(e)
    }
    return (
        <div className={`sidebaroffcanvas__container ${isOpen}`}>
            <div className="offcanvas__content">
                <div className="sidebaroffcanvas__header">
                    <h2>Profile</h2>
                    <CloseIcon onClick={() => handleOffCanvas('')} className="sidebaroffcanvas__close"/>
                </div>
                <div className="sidebaroffcanvas__subcontent">
                    <div className='sidebaroffcanvas__avatar__wrapper'>
                        <Avatar style={{width: '150px', height : '150px', margin : '0px auto'}}
                        	src={profile?.image
      											? `http://127.0.0.1:8000${profile.image}`
      											: ""}
                        />
                        <PhotoCameraOutlinedIcon className='upload__icon'/>
                        <input type="file" name="somename" accept="image/png, image/gif, image/jpeg" 
                            onChange={e => handleChange(e.target.files[0])} title=""
                        />
                    </div>
                    <div className={`sidebaroffcanvas__message ${show}`}>
                        <p>Profile Updated Succesfully!</p>
                    </div>
                    <form className="sidebaroffcanvas__form" onSubmit={handleSubmit}>
                        <label>Display Name</label>
                        <input type="text" placeholder="Display Name" value={name} onChange={e => setName(e.target.value)}/>
                        <label>Bio</label>
                        <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)}></textarea>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default SidebarOffCanvas;