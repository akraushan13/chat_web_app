import './ChatOffCanvas.css';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from "@mui/material";


const ChatOffCanvas = ({isOpen, handleOffCanvas, data}) => {
    return (
        <div className={`chatoffcanvas__container ${isOpen}`}>
            <div className="chatoffcanvas__content">
                <div className="chatoffcanvas__header">
                    <h2>{data && data.name}</h2>
                    <CloseIcon onClick={() => handleOffCanvas('')} className="chatoffcanvas__close"/>
                </div>
                <div className="chatoffcanvas__subcontent">
                    <Avatar style={{width: '150px', height : '150px', margin : '0px auto'}} src={data && data.contact.image}/>
                    <form className="chatoffcanvas__form">
                        <label>Display Name</label>
                        <input type="text" placeholder={data && data.name} readOnly/>
                        <label>Bio</label>
                        <textarea placeholder={data && data.contact.bio} readOnly></textarea>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default ChatOffCanvas;