import {StyleSheet} from 'react-native';

export const OfflinePopupStyle = (style: any, theme: any) =>
  StyleSheet.create({
    offlineBackDrop: {
      height: '100%',
      backgroundColor: `rgba(${style.color.blackRgb}, 0.7)`,
    },
    offline: {
      top: 12,
      left: 20,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: style.gutter.x,
      maxWidth: style.dimension.width - 45,
      justifyContent: 'center',
      paddingHorizontal: style.gutter.x,
      paddingVertical: style.gutter.x,
      borderRadius: 12,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.color.themeBorderColor ?? style.color.greyLighten,
      backgroundColor: theme.color.themeToastBg,
    },
    infoText: {
      paddingLeft: 10,
      fontSize: style.font.size,
      fontFamily: style.font.family,
      color: theme.color.themeTextColor ?? style.color.greyLighten,
    },
    toastIcon: {
      width: 6,
      height: 8,
    },
  });
