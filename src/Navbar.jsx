import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContexts } from "./providers/AuthProvider";

const Navbar = () => {
  const { user, signOutUser, theme, toggleTheme } = useContext(AuthContexts);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("User Signed Out");
        navigate("/");
      })
      .catch((err) => console.error("Sign-Out error:", err.message));
  };

  return (
    <div
      className={`mx-2 md:mx-8 mt-4 rounded-lg ${
        theme === "light" ? "bg-white text-black" : "bg-purple-600 text-white"
      }`}
    >
      <div
        className={`navbar rounded-lg px-4 ${
          theme === "light" ? "bg-gray-100" : "bg-base-100"
        }`}
      >
        <div className="navbar-start">
          <NavLink
            to="/"
            className={`text-lg md:text-2xl font-bold ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            Task Manager
          </NavLink>
        </div>

        <div className="hidden md:flex navbar-center gap-5">
          <NavLink
            to="/"
            className={`hover:text-gray-500 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            Home
          </NavLink>
          {user && (
            <NavLink
              to="/task"
              className={`hover:text-gray-500 ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              Tasks
            </NavLink>
          )}
        </div>

        <div className="navbar-end flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="btn btn-sm btn-outline">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* Authentication Links */}
          {!user ? (
            <div className="flex gap-4">
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-secondary btn-sm">
                Register
              </NavLink>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/40"}
                      alt="User"
                    />
                  </div>
                </div>
              </label>
              <ul
                tabIndex={0}
                className={`menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 ${
                  theme === "light"
                    ? "bg-gray-100 text-black"
                    : "bg-base-100 text-white"
                }`}
              >
                <li className="font-semibold text-center">
                  {user.displayName || "User"}
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-error btn-sm btn-block"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
