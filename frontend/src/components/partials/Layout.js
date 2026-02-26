import './Layout.css'
import Sidebar from './Sidebar'

const Layout = ({children, setIsLoggedIn}) => {
    return (
        <div className='layout__container'>
            <Sidebar setIsLoggedIn={setIsLoggedIn} />
            {children}
        </div>
    )
}


export default Layout;