import { cssInterop } from 'nativewind';
import React from 'react';
import { PieChart as Pie, PieChartPropsType } from 'react-native-gifted-charts';

export const PieNw = cssInterop(Pie, {
  textColorClassName: {
    target: false,
    nativeStyleToProp: {
      color: 'textColor',
    },
  },
  innerCircleColorClassName: {
    target: false,
    nativeStyleToProp: {
      color: 'innerCircleColor',
    },
  },
});

interface PieChartProps extends PieChartPropsType {
  textColorClassName?: string;
  innerCircleColorClassName?: string;
}

const PieChart = ({ textColorClassName, ...props }: PieChartProps) => {
  return <PieNw {...props} textColorClassName={textColorClassName} />;
};

export default PieChart;
