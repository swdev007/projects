import {StyleSheet} from 'react-native';

export const AccessListStyle = (style: any, theme: any) =>
  StyleSheet.create({
    caption: {
      fontSize: 12,
      marginTop: 20,
      textTransform: 'uppercase',
      color: theme.color.themeTextDarkGrayColor,
      fontFamily: style.font.family,
      paddingHorizontal: style.gutter.x,
    },
  });
