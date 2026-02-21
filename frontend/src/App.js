import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useState, useEffect } from "react";
import Home from "./components/Home";
import ChatDetail from "./components/ChatDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getToken  } from "./utils";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getToken() ? true : false);
  }, []);

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home isLoggedIn={isLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CHAT */}
        <Route
          path="/:id"
          element={
            isLoggedIn ? (
              <ChatDetail isLoggedIn={isLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
