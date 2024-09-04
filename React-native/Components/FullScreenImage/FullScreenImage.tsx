import React, {useContext, useEffect, useState} from 'react';
import {Image, Modal, Pressable, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {FullScreenMediaModalContext} from '../../context/modal/modal.context';
import {useThemeBasedOnSchema} from '../../context/theme/useTheme';
import {FullScreenImageStyle} from './FullScreenImage.style';

const FullScreenImage = () => {
  const {modalImage, setModalImage} = useContext(FullScreenMediaModalContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(modalImage ? true : false);
  }, [modalImage]);

  const closeModal = () => {
    setModalImage('');
    setOpen(false);
  };
  const {theme} = useThemeBasedOnSchema();
  const styles = FullScreenImageStyle(theme);

  return (
    <GestureRecognizer style={{flex: 1}} onSwipeDown={closeModal}>
      <Modal animationType="slide" visible={open}>
        <View style={styles.modal}>
          <Pressable onPress={closeModal} hitSlop={20}>
            <Image source={theme.icon.close} style={styles.close} />
          </Pressable>

          <Image
            style={styles.profileImgView}
            source={
              modalImage
                ? {uri: modalImage}
                : require('../../assets/images/avatar.png')
            }
          />
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

export default FullScreenImage;
