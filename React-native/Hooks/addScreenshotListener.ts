import {useIsFocused} from '@react-navigation/native';
import {debounce} from 'lodash';
import {useEffect, useRef} from 'react';
import {addScreenshotListener} from 'react-native-detector';
import {useSelector} from 'react-redux';
import {StoreInterface} from '../Store/Store';
import {CommunityMembershipModel} from '../models/community-membership.model';
import {RoleModel} from '../models/role.model';
import {
  allowScreenShot,
  forbidScreenShot,
  requestMediaPermissions,
} from '../services/util';

const useScreenShotListener = (
  navigation: any,
  mapping: CommunityMembershipModel | undefined,
) => {
  const screenShotRef = useRef<any>();
  const isFocused = useIsFocused();
  const disable_screenshots = useSelector(
    (store: StoreInterface) => store.remoteConfig.disable_screenshots,
  );

  const userDidScreenshot = debounce(() => {
    // add actions here if needed
  }, 100);

  useEffect(() => {
    if (
      isFocused &&
      (mapping?.role !== RoleModel.ADMIN ||
        mapping?.community.settings.disableArchive)
    ) {
      requestMediaPermissions();
      screenShotRef.current = addScreenshotListener(userDidScreenshot);
      if (disable_screenshots) {
        forbidScreenShot();
      }
    } else {
      if (screenShotRef?.current) {
        screenShotRef?.current();
      }
      if (disable_screenshots) {
        allowScreenShot();
      }
    }

    return () => {
      if (screenShotRef?.current) {
        screenShotRef.current();
      }
    };
  }, [
    isFocused,
    disable_screenshots,
    mapping?.role,
    navigation,
    userDidScreenshot,
    mapping?.community.settings.disableArchive,
  ]);

  return null;
};

export default useScreenShotListener;
