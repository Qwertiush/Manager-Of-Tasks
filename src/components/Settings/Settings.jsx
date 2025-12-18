import "./Settings.css";
import { settingsItemsData } from "../Data/data";

const Settings = ({
  settingsShown,
  user,
  setUser,
  setUserInfo,
  handleLogOut,
}) => {
  return (
    <div
      className={
        settingsShown ? "settings-container active" : "settings-container"
      }
    >
      <div className="settings">
        {settingsItemsData.map((item) => {
          return (
            <div onClick={handleLogOut} className="settings-item" key={item.id}>
              {item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
