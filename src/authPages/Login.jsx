import { useContext, useState } from "react";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { AuthContexts } from "../providers/AuthProvider";
import auth from "../firebase/firebase.init";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, signInUser } = useContext(AuthContexts);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const googleProvider = new GoogleAuthProvider();

  const handleEmailPasswordLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        setError(null);
        navigate("/");
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.error("Login error:", err.message);
        setError(err.message);
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        setUser(result.user);
        setError(null);
        navigate("/");
      })
      .catch((err) => {
        console.error("Google Sign-In error:", err.message);
        setError(err.message);
      });
  };

  const handleGoogleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setError(null);
      })
      .catch((err) => {
        console.error("Google Sign-Out error:", err.message);
        setError(err.message);
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {user ? (
            <div className="text-center">
              <p className="mb-2">Welcome, {user.displayName || user.email}</p>
              <button
                className="btn btn-secondary"
                onClick={handleGoogleSignOut}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailPasswordLogin}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered"
                    required
                  />
                  <label className="label">
                    <span
                      className="label-text-alt link link-hover"
                      onClick={() =>
                        navigate("/forgot-password", { state: { email } })
                      }
                    >
                      Forgot password?
                    </span>
                  </label>
                </div>

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}

              <div className="divider">OR</div>

              <div className="form-control">
                <button
                  className="btn btn-outline btn-secondary"
                  onClick={handleGoogleSignIn}
                >
                  Login with Google
                </button>
              </div>

              <div className="form-control">
                <Link to="/register" className="btn btn-accent">
                  Register First
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
