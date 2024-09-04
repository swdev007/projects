import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCommunityMemberShip,
  setCurrentCommunity,
} from '../../../Store/Profile/profile.slice';
import {StoreInterface} from '../../../Store/Store';
import {addNotification} from '../../../Store/notification/notification.slice';
import NotificationBlock from '../../../components/notification-block/NotificationBlock';
import ScrollArrow from '../../../components/scroll-arrow/ScrollArrow';
import SocietiesList from '../../../components/societies-list/SocietiesList';
import {useThemeBasedOnSchema} from '../../../context/theme/useTheme';
import {CommunityMembershipModel} from '../../../models/community-membership.model';
import {NotificationModel} from '../../../models/notification.model';
import {NotificationService} from '../../../services/notification.service';
import {UserService} from '../../../services/user.service';
import NoCommunityPage from '../../no-community-page/NoCommunityPage';
import {GlobalHomeStyle} from './GlobalHome.style';

const userService = new UserService();
const notificationService = new NotificationService();

const GlobalHome = () => {
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const communities = useSelector((store: StoreInterface) => {
    return store?.profile?.communityMembership || [];
  });

  const lockedCampusGroup = useSelector((store: StoreInterface) => {
    return store.profile.lockedCampusGroup || null;
  });

  const notifications = useSelector((store: StoreInterface) => {
    return store?.notification?.notifications || [];
  });
  const [showArrow, setShowArrow] = useState<boolean>(false);
  const sectionListRef = useRef<any>();

  const sectionList = useMemo(() => {
    return [
      {
        title: '',
        data: notifications,
      },
    ];
  }, [notifications]);

  const refreshCommunities = useCallback(async () => {
    try {
      const res = await userService.getCommunityMemberShip('NEW');
      const memberships = res.data.memberships.map(
        (_: any) => new CommunityMembershipModel(_),
      );
      dispatch(setCommunityMemberShip(memberships));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const getNotifications = useCallback(
    async (before: string, after: string) => {
      try {
        const res = await notificationService.getAllNotifications(
          before,
          after,
        );
        const newNotifications = res.data.notifications.map(
          (_: NotificationModel) => new NotificationModel(_),
        );
        dispatch(addNotification(newNotifications));
      } catch (error) {}
    },
    [dispatch],
  );

  useEffect(() => {
    refreshCommunities();
  }, [refreshCommunities]);

  useEffect(() => {
    getNotifications(new Date().toISOString(), '');
  }, [getNotifications]);

  const fetchNextPage = () => {
    if (notifications.length) {
      getNotifications(notifications[notifications.length - 1]?.createdAt, '');
    }
  };
  const {style, theme} = useThemeBasedOnSchema();
  const styles = GlobalHomeStyle(style, theme);

  const scrollToTop = useCallback(() => {
    sectionListRef?.current?.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 0,
    });
  }, []);

  const handleOnScroll = useCallback(
    ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (nativeEvent.contentOffset.y > 50) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isFocus) {
      dispatch(setCurrentCommunity(''));
    }
  }, [dispatch, isFocus]);
  return (
    <>
      {showArrow && (
        <ScrollArrow
          styles={styles.scrollDownWrapper}
          imageStyle={styles.scrollDown}
          onPress={scrollToTop}
        />
      )}

      <SectionList
        sections={sectionList}
        ref={sectionListRef}
        onScroll={handleOnScroll}
        contentContainerStyle={communities.length === 0 ? {flex: 1} : {}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: NotificationModel, index) => item.id + index}
        renderItem={({item}) => <NotificationBlock notification={item} />}
        ListHeaderComponent={() => (
          <SocietiesList
            list={communities}
            lockedCampusGroup={lockedCampusGroup}>
            <Text style={styles.title}>
              {communities.length > 0 ? 'Notifications' : ''}
            </Text>
          </SocietiesList>
        )}
        ListFooterComponentStyle={{
          flex: 1,
        }}
        ListFooterComponent={
          communities.length === 0 ? (
            <NoCommunityPage navigation={navigation} />
          ) : (
            <></>
          )
        }
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};
export default GlobalHome;
