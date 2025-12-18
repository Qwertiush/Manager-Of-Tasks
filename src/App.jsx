import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import LogIn from "../src/components/LogIn";
import { auth } from "./firebase/firebase-config";
import { signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setUser(false);
      setUserInfo(undefined);
    });
  };

  useEffect(() => {
    if (userInfo) {
      setIsLoading(false);
    }
  }, [userInfo]);

  if (!user) {
    return (
      <LogIn
        setUser={setUser}
        setIsLoading={setIsLoading}
        setUserInfo={setUserInfo}
      />
    );
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="app">
      <Navbar
        user={user}
        setUser={setUser}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        handleLogout={handleLogout}
      />
      <Main user={user} setUser={setUser} userInfo={userInfo} />
    </div>
  );
}

export default App;
