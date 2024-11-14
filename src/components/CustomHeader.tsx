import React from 'react';
import { Text, View } from 'react-native';

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  return (
    <View className="bg-red-500 p-4">
      <Text className="bg-green-600 text-lg font-bold text-red-500">{title}-1lsafjks</Text>
    </View>
  );
};

export default CustomHeader;
