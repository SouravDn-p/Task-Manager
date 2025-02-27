import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContexts } from "./providers/AuthProvider";
import {
  FiMenu,
  FiX,
  FiHome,
  FiClipboard,
  FiLogOut,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiUser,
} from "react-icons/fi";

const Navbar = () => {
  const { user, signOutUser, theme, toggleTheme } = useContext(AuthContexts);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("User Signed Out");
        navigate("/");
      })
      .catch((err) => console.error("Sign-Out error:", err.message));
  };

  const NavItem = ({ to, children, onClick = () => {} }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-lg transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        flex items-center gap-2
        ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : ""}
        after:content-[''] after:absolute after:bottom-0 after:left-0
        after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400
        after:scale-x-0 hover:after:scale-x-100 after:transition-transform
        ${isActive ? "after:scale-x-100" : ""}`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <div className="sticky top-4 z-50 mx-2 md:mx-8">
      <div
        className={`rounded-xl shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800
          ${
            theme === "light"
              ? "bg-white/90 text-gray-900"
              : "bg-gray-900/90 text-gray-100"
          }`}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <nav className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink
              to="/"
              className="text-xl md:text-2xl font-bold"
              style={{
                background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Task Manager
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <NavItem to="/">
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </NavItem>
              {user && (
                <NavItem to="/task">
                  <FiClipboard className="w-4 h-4" />
                  <span>Tasks</span>
                </NavItem>
              )}
            </div>

            {/* Theme Toggle & Authentication */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "light" ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>

              {!user ? (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="relative">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL || "/placeholder.svg"}
                          alt={user.displayName || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </div>
                    <FiChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <div className="flex flex-col gap-1">
                <NavItem to="/" onClick={() => setIsMenuOpen(false)}>
                  <FiHome className="w-4 h-4" />
                  <span>Home</span>
                </NavItem>
                {user && (
                  <NavItem to="/task" onClick={() => setIsMenuOpen(false)}>
                    <FiClipboard className="w-4 h-4" />
                    <span>Tasks</span>
                  </NavItem>
                )}
                {!user && (
                  <div className="flex flex-col gap-2 p-2">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
