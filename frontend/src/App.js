import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useState } from "react";
import Home from "./components/Home";
import ChatDetail from "./components/ChatDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getToken } from "./utils";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/:id"
          element={
            isLoggedIn ? (
              <ChatDetail />
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