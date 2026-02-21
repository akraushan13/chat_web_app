
const BASE_URL = 'http://127.0.0.1:8000/'
export const getToken = () => {
  return localStorage.getItem("token")
}



export default BASE_URL;