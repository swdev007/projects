import {StyleSheet} from 'react-native';
export const GlobalHomeStyle = (style: any, theme: any) =>
  StyleSheet.create({
    title: {
      fontSize: 16,
      lineHeight: 21,
      paddingHorizontal: style.gutter.x,
      color: theme.color.themeTextColor,
      fontFamily: style.font.familyLight,
      borderTopWidth: 1,
      marginBottom: 12,
      marginTop: 36,
      paddingTop: 24,
      borderTopColor: theme.color.themeTextDarkGrayColor,
    },
    scrollDownWrapper: {
      zIndex: 4,
      width: 45,
      height: 45,
      right: 10,
      display: 'flex',
      position: 'absolute',
      alignItems: 'flex-end',
      bottom: 37,
      justifyContent: 'flex-end',
      opacity: 1,
      transform: [{scaleY: -1}],
    },
    scrollDown: {
      width: 32,
      height: 32,
    },
  });
