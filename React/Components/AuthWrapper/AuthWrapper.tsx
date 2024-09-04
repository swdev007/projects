import loginImage from "../../assets/images/auth-image.jpeg";
import logo from "../../assets/images/logo.svg";
import style from "./AuthWrapper.module.scss";

interface AuthWrapperProps {
    children: JSX.Element;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    return (
        <div className={`${style.login} flex`}>
            <div className={style.login__image}>
                <img src={loginImage} alt="Login image" />
            </div>
            <div className={style.login__content}>
                <div className={` ${style.login__inner} flex justifyBetween flexCol`}>
                    <img src={logo} alt="logo" />
                    <div className={` ${style.login__form} flex justifyCenter flexCol`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
