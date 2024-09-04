import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLockedCampusGroup } from "../../Store/Profile/profile.slice";
import { StoreInterface } from "../../Store/Store";
import { STORAGE_ENUMS } from "../../assets/enums/storage.enums";
import GlobalHomeHeader from "../../components/header-components/GlobalHomeHeader";
import { ShortCommunityModel } from "../../models/short-community.model";
import { CampusGroupService } from "../../services/campus-group.service";
import GlobalHome from "../GlobalHome/GlobalHome";
import InActiveCommunityPage from "../inactive-community-page/InActiveCommunityPage";
import NoCommunityPage from "../no-community-page/NoCommunityPage";

const campusGroupService = new CampusGroupService();
const Home = () => {
  const memberships = useSelector((store: StoreInterface) => {
    return store?.profile?.communityMembership || [];
  });

  const lockedCampusGroup = useSelector((store: StoreInterface) => {
    return store.profile?.lockedCampusGroup || null;
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const removeLastVisitKey = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_ENUMS.LAST_VISIT_CHAT_ROOM);
  }, []);

  const getCampusGroup = useCallback(async () => {
    try {
      const res = await campusGroupService.getInvitationsWithoutToken();
      if (res.data.lockedCampusGroup) {
        dispatch(
          addLockedCampusGroup(
            new ShortCommunityModel(res.data.lockedCampusGroup)
          )
        );
      } else {
        dispatch(addLockedCampusGroup(null));
      }
    } catch (error) {}
  }, [dispatch]);

  useEffect(() => {
    if (isFocused) {
      removeLastVisitKey();
      getCampusGroup();
    }
  }, [isFocused, removeLastVisitKey, getCampusGroup]);

  return (
    <>
      <GlobalHomeHeader />

      {lockedCampusGroup ? (
        <GlobalHome />
      ) : memberships?.length === 0 ? (
        <NoCommunityPage navigation={navigation} />
      ) : memberships.length === 1 &&
        memberships[0].community.active === false ? (
        <InActiveCommunityPage
          navigation={navigation}
          communityId={memberships[0].community.id}
        />
      ) : (
        <GlobalHome />
      )}
    </>
  );
};

export default Home;
