import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const Login = ({ setIsLoggedIn }) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", data.user)
      setIsLoggedIn(true)
      navigate("/")
    } else {
      alert(data.error || "Login failed")
    }
  }

  return (
    <div className="auth__container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Phone / Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  )
}

export default Login
