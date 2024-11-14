import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { cssInterop } from 'nativewind';

export const MatCommunityIcons = cssInterop(MaterialCommunityIcons, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: 'color',
    },
  },
});
