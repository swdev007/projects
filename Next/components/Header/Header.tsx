"use client";

import { AuthTab } from "@/app/_lib/enum/modal.enum";
import { StorageEnums } from "@/app/_lib/enum/storage";
import { setUserData } from "@/app/_lib/GlobalRedux/Slices/auth.slice";
import {
  setAuthModal,
  setAuthTab,
} from "@/app/_lib/GlobalRedux/Slices/modal.slice";
import { StoreInterface } from "@/app/_lib/GlobalRedux/store";
import { StorageService } from "@/app/_lib/services/storageServices";
import Logo from "@/assets/images/logo.svg";
import { deleteCookie, getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../Button/Button";
import { NavLinks } from "./Header.constants";
import style from "./Header.module.scss";
const Header = ({ background = false }: { background?: boolean }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const pathname = usePathname();
  const userData = useSelector((state: StoreInterface) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const storageService = new StorageService();
  let token = getCookie(StorageEnums.CREDENTIALS);

  const login = useCallback(() => {
    if (token) {
      dispatch(setUserData({ user: {}, isLoggedIn: false }));
      storageService.removeKey(StorageEnums.CREDENTIALS);
      deleteCookie(StorageEnums.CREDENTIALS);
      closeNavDrawer();
    } else {
      closeNavDrawer();
      dispatch(setAuthTab(AuthTab.LOG_IN));
      dispatch(setAuthModal(true));
    }
  }, [userData]);

  const closeNavDrawer = () => {
    setIsNavDrawerOpen(false);
  };

  const navigateTo = (route: string) => {
    let tokens = getCookie(StorageEnums.CREDENTIALS);
    if (!tokens && route == "/dashboard") {
      toast.error("Session expired");
      dispatch(setUserData({ isLoggedIn: false }));
    } else {
      closeNavDrawer();
      router.push(route);
    }
  };
  const toggleNavDrawer = useCallback(
    () => setIsNavDrawerOpen((value) => !value),
    []
  );

  const messageHandler = () => {
    const recipientEmail = "info@gmail.com";

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}`;

    window.open(gmailLink, "_blank");
  };

  const scrollToSection = () => {
    const section = document.getElementById("about_us_section");

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (isNavDrawerOpen) {
      document.body.classList.add("disableScroll");
    } else {
      document.body.classList.remove("disableScroll");
    }
  }, [isNavDrawerOpen]);

  return (
    <header className={`${style.header} ${!background && style.isDark}`}>
      <div className="container flex-wrap align-center justify-between">
        <div className={style.header__logo}>
          <Image src={Logo} alt="LOGO" />
        </div>

        <div
          className={`${style.header__nav} ${
            isNavDrawerOpen ? style.isActive : ""
          }`}
        >
          <nav>
            {NavLinks.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  shallow={true}
                  prefetch={true}
                  className={pathname === item.href ? style.active : ""}
                  onClick={() => {
                    navigateTo(item?.href);
                  }}
                >
                  {item.title}
                </Link>
              );
            })}
            <a
              key={"about-us"}
              onClick={() => {
                scrollToSection();
              }}
            >
              About Us
            </a>

            <Link
              href={""}
              key={"contact-us"}
              onClick={() => {
                messageHandler();
              }}
            >
              Contact Us
            </Link>

            {token && (
              <Link
                key={"/dasboard"}
                href={token ? "/dashboard" : "/"}
                shallow={true}
                prefetch={true}
                className={pathname === "/dashboard" ? style.active : ""}
                onClick={() => navigateTo("/dashboard")}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <Button onClick={login} label={token ? "Logout" : "Login"} />
        </div>

        <a
          className={`${style.header__hamburger} ${
            isNavDrawerOpen ? style.isActive : ""
          }`}
          onClick={toggleNavDrawer}
        >
          <span></span>
        </a>
        <div
          className={`${style.header__overlay} ${
            isNavDrawerOpen ? style.isActive : ""
          }`}
          onClick={closeNavDrawer}
        ></div>
      </div>
    </header>
  );
};
export default Header;
