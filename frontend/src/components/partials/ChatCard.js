import './ChatCard.css'
import { Avatar } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import {Link} from 'react-router-dom'


const ChatCard = ({contacts}) => {
    const listItems = contacts && contacts.map((contact, index) =>
    <div key={contact.pk || contact.slug} className="chatcard__container">
        <Avatar src={contact.contact.image}/>
        <Link to={`/${contact.slug}`} className="chatcard__link">
        <div style={{margin : '0 10px', width : '100%'}}>
            <h5>
                {contact.name} {contact.contact.verified ? <VerifiedIcon style={{width : 15, height : 15, color : 'green'}} /> : ''}
            </h5>
            <p></p>
        </div>
        </Link>
    </div>
    );
    return (
        <div>
            {listItems}
        </div>
    )
}

export default ChatCard;