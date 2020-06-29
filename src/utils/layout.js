import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const { width: ww, height: wh } = Dimensions.get('window');
const { width: sw, height: sh } = Dimensions.get('screen');

export default {
  width,
  height,
  isSmallDevice: width < 375,
};

export const getww = percent => (ww * percent) / 100;

export const getwh = percent => (wh * percent) / 100;

export const getsw = percent => (sw * percent) / 100;

export const getsh = percent => (sh * percent) / 100;

export const fullWidth = getww(100);

export function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}
