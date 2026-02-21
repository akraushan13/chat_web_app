import './Layout.css'
import Sidebar from './Sidebar'

const Layout = ({children}) => {
    return (
        <div className='layout__container'>
            <Sidebar/>
            {children}
        </div>
    )
}


export default Layout;