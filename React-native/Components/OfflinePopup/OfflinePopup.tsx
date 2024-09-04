import {NetInfoState, useNetInfo} from '@react-native-community/netinfo';
import React, {useEffect, useState} from 'react';
import {Image, Modal, Text, View} from 'react-native';
import {useThemeBasedOnSchema} from '../../context/theme/useTheme';
import {OfflinePopupStyle} from './OfflinePopup.style';

const OfflinePopup = ({checkForProfile}: {checkForProfile: Function}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const internetState: NetInfoState = useNetInfo();
  const [currentState, setCurrentState] = useState(true);
  const [prevState, setPrevState] = useState(true);
  const {style, theme} = useThemeBasedOnSchema();
  const styles = OfflinePopupStyle(style, theme);

  useEffect(() => {
    if (internetState.isConnected === null) {
      return;
    }
    setPrevState(currentState);
    setCurrentState(internetState.isConnected);
    setShowPopup(!internetState.isConnected);
  }, [internetState, internetState.isConnected, currentState]);

  useEffect(() => {
    if (prevState === false && currentState === true) {
      checkForProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevState, currentState]);

  return (
    <Modal transparent={true} animationType={'none'} visible={showPopup}>
      <View style={styles.offlineBackDrop}>
        <View style={styles.offline}>
          <Image style={styles.toastIcon} source={theme.icon.xIcon} />
          <Text style={styles.infoText}> You are offline </Text>
        </View>
      </View>
    </Modal>
  );
};
export default OfflinePopup;
