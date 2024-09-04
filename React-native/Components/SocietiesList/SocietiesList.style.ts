import {StyleSheet} from 'react-native';

export const SocietiesListStyle = (style: any, theme: any) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 24,
    },
    title: {
      fontSize: 16,
      lineHeight: 21,
      marginBottom: 24,
      paddingHorizontal: style.gutter.x,
      color: theme.color.themeTextColor,
      fontFamily: style.font.familyLight,
    },
    list: {
      paddingHorizontal: style.gutter.x - 10,
    },
    addWrap: {
      width: 105,
      paddingTop: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addIconWrap: {
      width: 75,
      height: 75,
      borderWidth: 1,
      display: 'flex',
      borderRadius: 50,
      marginBottom: 17,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.color.themePrimaryColor,
    },
    addIcon: {
      width: 30,
      height: 30,
    },
    addText: {
      width: '100%',
      fontSize: 14,
      lineHeight: 18,
      textAlign: 'center',
      color: theme.color.themePrimaryColor,
      fontFamily: style.font.familyLight,
    },
  });
