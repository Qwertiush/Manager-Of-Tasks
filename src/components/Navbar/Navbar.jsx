import { useState } from "react";
import "./Navbar.css";
import Settings from "../Settings";
import { auth } from "../../firebase/firebase-config";

const Navbar = ({ user, setUser, userInfo, setUserInfo, handleLogout }) => {
  const [settingsShown, setSettingsShown] = useState(false);

  const handleSettingsOpening = () => {
    setSettingsShown(!settingsShown);
  };

  return (
    <div>
      <div className="navbar-container">
        <div className="navbar">
          <div>Manager of {user && userInfo.name}'s Tasks</div>
          <button onClick={handleSettingsOpening}>|||</button>
        </div>
      </div>
      <Settings
        settingsShown={settingsShown}
        user={user}
        setUser={setUser}
        setUserInfo={setUserInfo}
        handleLogOut={handleLogout}
      />
    </div>
  );
};

export default Navbar;
