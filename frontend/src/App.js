import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./components/Home";
import ChatDetail from "./components/ChatDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { isAuthenticated } from "./utils/auth";

function App() {

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={
            isAuthenticated()
              ? <Navigate to="/" />
              : <Login />
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/:id"
          element={
            <PrivateRoute>
              <ChatDetail />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;