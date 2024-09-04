import {StyleSheet} from 'react-native';

export const FullScreenImageStyle = (theme: any) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: theme.color.themeBgColor,
    },
    profileImgView: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      resizeMode: 'contain',
      justifyContent: 'center',
      zIndex: -1,
    },
    close: {
      width: 15,
      height: 15,
      right: 16,
      top: 16,
      position: 'absolute',
      zIndex: 1,
    },
  });
