import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, View } from 'react-native';

import { AmortizationSchedule } from '@/types/EmiCalcTypes';

const AmortizationTable = ({
  amortizationSchedule,
  ...props
}: {
  amortizationSchedule: AmortizationSchedule;
}) => {
  if (amortizationSchedule.length > 0) {
    return (
      <View className="mt-4 flex-1">
        <View className="flex-row border-b border-gray-300 p-2">
          <Text className="flex-1 font-bold text-fg">Month</Text>
          <Text className="flex-1 font-bold text-fg">EMI</Text>
          <Text className="flex-1 font-bold text-fg">Principal</Text>
          <Text className="flex-1 font-bold text-fg">Interest</Text>
          <Text className="flex-1 font-bold text-fg">Balance</Text>
        </View>
        <FlashList
          data={amortizationSchedule}
          renderItem={({ item }) => (
            <View className="flex-row border-hairline border-b-hairline border-gray-300 p-2">
              <Text className="flex-1 text-fg">{item.month}</Text>
              <Text className="flex-1 text-fg">{item.emi}</Text>
              <Text className="flex-1 text-fg">{item.principalPayment}</Text>
              <Text className="flex-1 text-fg">{item.interest}</Text>
              <Text className="flex-1 text-fg">{item.balance}</Text>
            </View>
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.month.toString()}
        />
      </View>
    );
  } else {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-fg/5 text-2xl font-bold">No data</Text>
      </View>
    );
  }
};

export default AmortizationTable;
