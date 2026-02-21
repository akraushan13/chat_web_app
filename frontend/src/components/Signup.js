import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const Signup = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()


const handleSignup = async (e) => {
  e.preventDefault()

  const res = await fetch("http://127.0.0.1:8000/api/signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  const data = await res.json()

  if (res.status === 201) {
    alert("Signup successful! Please login.")
    navigate("/login")
  } else {
    alert(data.error || "Signup failed")
  }
}


  return (
    <div className="auth__container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Phone / Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Signup
