"use client";
import { ApiService } from "@/app/_lib/services/apiServices";
import { StorageService } from "@/app/_lib/services/storageServices";
import { getProfile } from "@/app/_lib/utils/apiFunctions";
import { refreshTokenIfNeeded, showErrorToast } from "@/app/_lib/utils/helpers";
import { SelectModes } from "@/components/Banner/BannerForm/BannerForm.constants";
import GlobalLoader from "@/components/GlobalLodaer/GlobalLoader";
import Table from "@/components/Table/Table";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  buyerTableHeaderData,
  buyerTableRowDataHandler,
} from "../_lib/constants/table";
import { BidStatusEnum, RequestAction } from "../_lib/enum/bids.enum";
import { StorageEnums } from "../_lib/enum/storage";
import { setUserData } from "../_lib/GlobalRedux/Slices/auth.slice";
import { StoreInterface } from "../_lib/GlobalRedux/store";
import style from "./Dashboard.module.scss";
const Modal = dynamic(() => import("@/components/Modal/Modal"));
const ConfirmationModal = dynamic(
  () => import("@/components/Modal/ConfirmationModal")
);
export default function BuyerDashBoard() {
  //router
  const router = useRouter();
  //   Local state
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  // redux
  const userData = useSelector((store: StoreInterface) => store.auth);
  const dispatch = useDispatch();
  //   Services
  const storageService = new StorageService();
  const apiService = new ApiService();

  async function getRequestCommodity() {
    try {
      let tokens = storageService.getKey(StorageEnums.CREDENTIALS);
      if (!tokens?.accessToken) {
        return;
      }
      tokens = await refreshTokenIfNeeded(tokens?.accessToken);
      setLoading(true);
      let payload = {
        headerToken: `Bearer ${tokens}`,
        url: "requested-commodity",
      };
      const res = await apiService.get(payload);
      setRequestList(res?.data);
    } catch (err: any) {
      showErrorToast(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function makeRequestCommodity() {
    try {
      let tokens = storageService.getKey(StorageEnums.CREDENTIALS);
      tokens = await refreshTokenIfNeeded(tokens?.accessToken);
      const pendingRequest = storageService.getKey(
        StorageEnums.PENDING_REQUEST
      );
      if (pendingRequest) {
        let payloadDataValue =
          pendingRequest?.mode.value === SelectModes.ManualSelect
            ? {
                year: pendingRequest?.year,
                make: pendingRequest?.make,
                model: pendingRequest?.model,
                color: pendingRequest?.color,
              }
            : {
                link: pendingRequest?.vehicleLink,
              };
        let payload = {
          data: payloadDataValue,
          headerToken: `Bearer ${tokens}`,
          url: "requested-commodity",
        };
        setLoading(true);
        await apiService.post(payload);
        storageService.removeKey(StorageEnums.PENDING_REQUEST);
        toast.success("Request submitted successfully");
      }
      await getRequestCommodity();
    } catch (err: any) {
      setLoading(false);
      showErrorToast(err);
    }
  }

  async function acceptRequest(id: any) {
    try {
      let tokens = storageService.getKey(StorageEnums.CREDENTIALS);
      if (!tokens?.accessToken) {
        toast.error("Session expired");
        dispatch(setUserData({ isLoggedIn: false }));
        router.push("/");
        return;
      }
      tokens = await refreshTokenIfNeeded(tokens?.accessToken);
      let payload = {
        headerToken: `Bearer ${tokens}`,
        url: `bid/${id}/update-status`,
        data: {
          status: BidStatusEnum.ACCEPTED,
        },
      };
      setModalShow(false);
      setLoading(true);
      const res = await apiService.put(payload);
      toast.success("Offer accepted.");
      await getProfileData();
      await getRequestCommodity();
    } catch (err: any) {
      setLoading(false);
      setModalShow(false);
      showErrorToast(err);
    }
  }
  function cancelOfferConfirmation() {
    setModalShow(false);
    setSelectedBid(null);
  }
  const messageHandler = (id: any) => {
    const recipientEmail = "info@gmail.com";

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}`;

    window.open(gmailLink, "_blank");
  };
  let buyerTableHeaderDataMap = buyerTableHeaderData.map((el: any) => {
    if (el.actionType === RequestAction.ACCEPT_REQUEST) {
      return {
        ...el,
        action: (id: any) => {
          setModalShow(true);
          setSelectedBid(id);
        },
      };
    }
    if (el.actionType === RequestAction.MESSAGE) {
      return { ...el, action: messageHandler };
    }
    return el;
  });

  async function getProfileData() {
    try {
      const res = await getProfile();
      dispatch(setUserData({ user: res, isLoggedIn: true }));
    } catch (err: any) {}
  }

  useEffect(() => {
    getProfileData();
    makeRequestCommodity();
    document.body.classList.remove("disableScroll");
    router.prefetch("/");
  }, []);

  return (
    <>
      {loading && <GlobalLoader />}
      <div className={style.dashboard}>
        <div className="container-fluid">
          <h1>Dashboard</h1>
          <div className={style.dashboard__info}>
            <h2>Hello {userData?.user?.name}!</h2>
            <p>
              Welcome to your vehicle dashboard, where you can navigate and view
              your offers from various dealers. If you have queries for specific
              dealer or comments, click on "Message Me" and we will provide the
              feedback directly to the dealer and come back to you. We will
              provide any details from the vehicle in the vehicle detail section
              for your reference. Thank you again for using!
            </p>
          </div>
          <div className={style.dashboard__request}>
            <h2>My Requests</h2>
            <div>
              <Table
                emptyMessage={"No Request Made"}
                tableHeadings={buyerTableHeaderDataMap}
                tableRowData={buyerTableRowDataHandler(requestList)}
              />
            </div>
          </div>
        </div>
        {modalShow && (
          <Modal
            showModal={modalShow}
            showModalFunction={setModalShow}
            title="Add project information"
          >
            <ConfirmationModal
              title="Are you sure you want to accept this offer?"
              accept={() => acceptRequest(selectedBid)}
              reject={cancelOfferConfirmation}
              loading={loading}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
