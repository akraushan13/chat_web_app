import { useState } from "react"
import { Link } from "react-router-dom"
import { loginUser } from "../api/authService"
import "./Auth.css"

const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await loginUser({ username, password })

      window.location.href = "/"

    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Sign In</h2>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="text"
            placeholder="Username / Phone"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="auth-btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login