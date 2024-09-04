import React, {useState} from 'react';
import {Image, ViewStyle} from 'react-native';

export interface ResizeImage {
  styles: ViewStyle;
  imageUrl?: string;
  minHeight: number;
  maxHeight: number;
}
const ResizeImage = ({styles, imageUrl, minHeight, maxHeight}: any) => {
  const [imageHeight, setImageHeight] = useState(290);

  const handleHeight = (height: number) => {
    if (height < minHeight) {
      setImageHeight(minHeight);
    } else if (height >= minHeight && height <= maxHeight) {
      setImageHeight(height);
    } else if (height > maxHeight) {
      setImageHeight(maxHeight);
    }
  };

  return (
    <Image
      onLoad={({
        nativeEvent: {
          source: {height},
        },
      }) => handleHeight(height)}
      style={[styles, {height: imageHeight}]}
      source={
        imageUrl ? {uri: imageUrl} : require('../../assets/images/avatar.png')
      }
    />
  );
};
export default ResizeImage;
