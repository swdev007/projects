"use client";
import { setUserData } from "@/app/_lib/GlobalRedux/Slices/auth.slice";
import { StoreInterface } from "@/app/_lib/GlobalRedux/store";
import { StorageEnums } from "@/app/_lib/enum/storage";
import { StorageService } from "@/app/_lib/services/storageServices";
import AngleDown from "@/assets/images/angle-down.svg";
import Logo from "@/assets/images/logo.svg";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import style from "./HeaderDashboard.module.scss";

const HeaderDashboard = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const storageService = new StorageService();
  const userData = useSelector((store: StoreInterface) => store.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  let logout = () => {
    dispatch(setUserData({ user: {}, isLoggedIn: false }));
    storageService.removeKey(StorageEnums.CREDENTIALS);
    deleteCookie(StorageEnums.CREDENTIALS);

    setDropdownVisible(false);
    router.replace("/");
  };

  let navigateTo = (route: string) => {
    setDropdownVisible(false);
    router.push(route);
  };

  useEffect(() => {
    if (isDropdownVisible) {
      router.prefetch("/");
    }
  }, [isDropdownVisible]);
  return (
    <>
      {isDropdownVisible && (
        <div
          className={style.header__backdrop}
          onClick={() => setDropdownVisible(false)}
        ></div>
      )}
      <header className={style.header}>
        <div className="container-fluid flex-wrap align-center justify-between">
          <div
            onClick={() => {
              navigateTo("/");
            }}
            className={style.header__logo}
          >
            <Image src={Logo} alt="Logo" />
          </div>
          <div className={style.header__profile}></div>

          <DropdownMenu menuState={setDropdownVisible}>
            <div className={style.header__profile}>
              <div className={`flex align-center`}>
                <aside onClick={() => setDropdownVisible(!isDropdownVisible)}>
                  <strong>{userData?.user?.name ?? ""}</strong>
                  <p>{userData?.user?.email ?? ""}</p>
                </aside>
                <Image
                  onClick={() => setDropdownVisible(!isDropdownVisible)}
                  src={AngleDown}
                  alt="Arrow"
                />
              </div>
              {isDropdownVisible && (
                <ul>
                  <li
                    onClick={(e: any) => {
                      navigateTo("/");
                    }}
                  >
                    Home
                  </li>
                  <li
                    onClick={(e: any) => {
                      logout();
                    }}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};
export default HeaderDashboard;
