import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { clearLocalStorageIfNoCredentials } from "../../utils/helpers";
import CustomButton from "../Button/Button";
import styles from "./Header.module.scss";

export default function Header() {
  const navigate = useNavigate();
  const logout = () => {
    clearLocalStorageIfNoCredentials();
    navigate("/");
  };
  return (
    <header className={`flex alignCenter justifyBetween ${styles.header}`}>
      <img src={logo} alt="logo" />
      <CustomButton title="LOG OUT" type="submit" onClick={logout} />
    </header>
  );
}
