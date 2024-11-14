import { Text, View, type ViewProps } from 'react-native';

import EditScreenInfo from './EditScreenInfo';

import { ThemeToggle } from '@/components/ThemeToggle';

type ScreenContentProps = ViewProps & {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-fg/5 text-2xl font-bold">{title}</Text>
      <ThemeToggle />
      <View className="my-8 h-[1px] w-4/5 bg-slate-400" />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
