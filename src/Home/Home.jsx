import { useContext } from "react";
import { AuthContexts } from "../providers/AuthProvider";
import Lottie from "lottie-react";
import SdGamer from "../assets/SdGamer.json";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const Home = () => {
  const { user, theme } = useContext(AuthContexts); // Get theme from context

  const themeStyles = {
    light: {
      backgroundColor: "#FFFFF0",
      color: "#000000",
    },
    dark: {
      backgroundColor: "#000000",
      color: "#FFFFF0",
    },
  };

  const [text] = useTypewriter({
    words: ["Eat", "Sleep", "Game", "Repeat!"],
    loop: true,
    typeSpeed: 70,
  });

  return (
    <div
      style={{
        backgroundColor: themeStyles[theme].color,
        color: themeStyles[theme].backgroundColor,
      }}
      className="text-white animate__animated animate__bounce rounded-lg mt-4 min-h-screen flex flex-col justify-center items-center"
    >
      <Lottie animationData={SdGamer} loop={true} className="w-64" />

      <h1 className="animate__animated animate__headShake text-4xl font-bold text-center mt-4">
        {user
          ? `Welcome to Your Profile, ${user.displayName}!`
          : "Login to enjoy Chill Gamer Anonymous!"}
      </h1>

      <h1 className="text-4xl font-bold text-center pt-4">
        Life is simple
        <span className="text-red-500"> {text}</span>
        <Cursor cursorStyle="|" />
      </h1>
    </div>
  );
};

export default Home;
