import { useState } from "react"
import { Link } from "react-router-dom"
import { signupUser } from "../api/authService"
import "./Auth.css"

const Signup = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      await signupUser({ username, password })

      alert("Signup successful! Please login.")

      window.location.href = "/login"

    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>
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
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup