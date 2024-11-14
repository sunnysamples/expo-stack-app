import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Dimensions, ScrollView, Alert, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { z } from 'zod';

import PieChart from '@/components/charts/PieChart';
import AmortizationTable from '@/components/fin/AmortizationTable';
import { AmortizationScheduleItem } from '@/types/EmiCalcTypes';

const screenWidth = Dimensions.get('window').width;

const fieldLabels = {
  loanAmount: 'Loan Amount',
  interestRate: 'Interest Rate',
  loanTenureYears: 'Loan Tenure (Years)',
  loanTenureMonths: 'Loan Tenure (Months)',
  emi: 'EMI',
};

const loanSchema = z
  .object({
    loanAmount: z
      .number({
        required_error: 'Loan amount is required',
        invalid_type_error: 'Loan amount must be a number',
      })
      .positive('Loan amount must be a positive number')
      .optional(),
    interestRate: z
      .number({
        required_error: 'Interest rate is required',
        invalid_type_error: 'Interest rate must be a number',
      })
      .positive('Interest rate must be a positive number')
      .optional(),
    loanTenureYears: z
      .number({
        required_error: 'Loan tenure years are required',
        invalid_type_error: 'Loan tenure years must be a number',
      })
      .nonnegative('Loan tenure years must be a non-negative number')
      .optional(),
    loanTenureMonths: z
      .number({
        required_error: 'Loan tenure months are required',
        invalid_type_error: 'Loan tenure months must be a number',
      })
      .nonnegative('Loan tenure months must be a non-negative number')
      .optional(),
    emi: z
      .number({
        required_error: 'EMI is required',
        invalid_type_error: 'EMI must be a number',
      })
      .optional(),
  })
  .refine(
    (data) => {
      const { loanTenureYears, loanTenureMonths } = data;
      return loanTenureYears !== undefined || loanTenureMonths !== undefined;
    },
    {
      message: 'Either loan tenure years or loan tenure months must be provided',
      path: ['loanTenureYears', 'loanTenureMonths'],
    }
  )
  .refine(
    (data) => {
      const { loanAmount, interestRate, loanTenureYears, loanTenureMonths, emi } = data;
      const tenureInMonths = (loanTenureYears || 0) * 12 + (loanTenureMonths || 0);
      return (
        (loanAmount && interestRate && tenureInMonths) ||
        (interestRate && tenureInMonths && emi) ||
        (loanAmount && tenureInMonths && emi) ||
        (loanAmount && interestRate && emi)
      );
    },
    {
      message: 'At least three fields must be provided',
    }
  );

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenureYears, setLoanTenureYears] = useState('');
  const [loanTenureMonths, setLoanTenureMonths] = useState('');
  const [emi, setEmi] = useState('');

  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationScheduleItem[]>([]);
  const [totalInterest, setTotalInterest] = useState(0);
  const [calculatedField, setCalculatedField] = useState('');

  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0.05);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: `rgba(0, 0, 0, ${bgOpacity.value})`,
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.1);
    bgOpacity.value = withTiming(0.1);
    rippleScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
    rippleOpacity.value = withTiming(0.5, { duration: 500, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    bgOpacity.value = withTiming(0.05);
    rippleScale.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
    rippleOpacity.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
  };

  const calculateEMI = () => {
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedInterestRate = parseFloat(interestRate);
    const parsedLoanTenureYears = loanTenureYears ? parseInt(loanTenureYears, 10) : undefined;
    const parsedLoanTenureMonths = loanTenureMonths ? parseInt(loanTenureMonths, 10) : undefined;
    const parsedEmi = emi ? parseFloat(emi) : undefined;

    const result = loanSchema.safeParse({
      loanAmount: parsedLoanAmount,
      interestRate: parsedInterestRate,
      loanTenureYears: parsedLoanTenureYears,
      loanTenureMonths: parsedLoanTenureMonths,
      emi: parsedEmi,
    });

    if (!result.success) {
      const errorMessages = result.error.errors
        .map(
          (error) => `${fieldLabels[error.path[0] as keyof typeof fieldLabels]} - ${error.message}`
        )
        .join('\n');
      Alert.alert('Validation Error', errorMessages);
      return;
    }

    const principal = parsedLoanAmount;
    const annualInterestRate = parsedInterestRate / 100;
    const monthlyInterestRate = annualInterestRate / 12;
    const tenureInMonths = (parsedLoanTenureYears || 0) * 12 + (parsedLoanTenureMonths || 0);

    let emiValue = parsedEmi;
    if (!emiValue) {
      emiValue =
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
      setEmi(emiValue.toFixed(2));
      setCalculatedField('emi');
    } else if (!parsedLoanAmount) {
      const loanAmountValue =
        (emiValue * (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1)) /
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths));
      setLoanAmount(loanAmountValue.toFixed(2));
      setCalculatedField('loanAmount');
    }

    const schedule = [];
    let balance = principal;
    let totalInterestPaid = 0;
    for (let i = 0; i < tenureInMonths; i++) {
      const interest = balance * monthlyInterestRate;
      const principalPayment = emiValue - interest;
      balance -= principalPayment;
      totalInterestPaid += interest;
      schedule.push({
        month: i + 1,
        emi: emiValue.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance.toFixed(2),
      });
    }
    setAmortizationSchedule(schedule);
    setTotalInterest(parseFloat(totalInterestPaid.toFixed(2)));
  };

  useEffect(() => {
    if (loanAmount && interestRate && (loanTenureYears || loanTenureMonths)) {
      setCalculatedField('emi');
    } else if (interestRate && (loanTenureYears || loanTenureMonths) && emi) {
      setCalculatedField('loanAmount');
    } else if (loanAmount && (loanTenureYears || loanTenureMonths) && emi) {
      setCalculatedField('interestRate');
    } else if (loanAmount && interestRate && emi) {
      setCalculatedField('loanTenure');
    } else {
      setCalculatedField('');
    }
  }, [loanAmount, interestRate, loanTenureYears, loanTenureMonths, emi]);

  //calculate interest and principal percentiage of total amount
  //can we get percentiages rounded to 2 decimal places?

  const totalAmount = parseFloat(loanAmount) + totalInterest;
  const totalInterestPercentage = (totalInterest / totalAmount) * 100;
  const totalPrincipalPercentage = 100 - totalInterestPercentage;

  const pieData = [
    {
      value: parseFloat(loanAmount),
      color: '#0A420CFF',
      gradientCenterColor: '#12FA1EFF',
      text: 'Principal: ' + totalInterestPercentage.toFixed(2) + '%',
    },
    {
      value: totalInterest,
      color: '#FF3410FF',
      gradientCenterColor: '#710503FF',
      text: 'Interest: ' + totalPrincipalPercentage.toFixed(2) + '%',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-bg p-4">
      <Text className="mb-2 text-lg text-fg">Loan Amount</Text>
      <TextInput
        className={`mb-4 rounded border border-gray-300 p-2 text-fg ${calculatedField === 'loanAmount' ? 'bg-inputDisabled' : ''}`}
        keyboardType="numeric"
        value={loanAmount}
        onChangeText={setLoanAmount}
        editable={calculatedField !== 'loanAmount'}
      />

      <Text className="mb-2 text-lg text-fg">Interest Rate (%)</Text>
      <TextInput
        className={`mb-4 rounded border border-gray-300 p-2 text-fg ${calculatedField === 'interestRate' ? 'bg-inputDisabled' : ''}`}
        keyboardType="numeric"
        value={interestRate}
        onChangeText={setInterestRate}
        editable={calculatedField !== 'interestRate'}
      />

      <Text className="mb-2 text-lg text-fg">Loan Tenure (Years)</Text>
      <TextInput
        className="mb-4 rounded border border-gray-300 p-2 text-fg"
        keyboardType="numeric"
        value={loanTenureYears}
        onChangeText={setLoanTenureYears}
      />

      <Text className="mb-2 text-lg text-fg">Loan Tenure (Months)</Text>
      <TextInput
        className="mb-4 rounded border border-gray-300 p-2 text-fg"
        keyboardType="numeric"
        value={loanTenureMonths}
        onChangeText={setLoanTenureMonths}
      />

      <Text className="mb-2 text-lg text-fg">EMI</Text>
      <TextInput
        className={`mb-4 rounded border border-gray-300 p-2 text-fg ${calculatedField === 'emi' ? 'bg-inputDisabled' : ''}`}
        keyboardType="numeric"
        value={emi}
        onChangeText={setEmi}
        editable={calculatedField !== 'emi'}
      />

      <View className="items-center justify-center">
        <Animated.View
          className="border-fg/50 bg-fg/5 mb-4 h-12 w-4/5 items-center justify-center rounded-full border-hairline"
          style={animatedStyle}>
          <Pressable
            className="h-full w-full items-center justify-center rounded-full"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={calculateEMI}>
            <Text className="text-fg/80">Calculate</Text>
          </Pressable>
          <Animated.View
            className="absolute h-full w-full rounded-full bg-red-400"
            style={rippleStyle}
          />
        </Animated.View>
      </View>

      {totalInterest > 0 && (
        <View className="mt-4">
          <PieChart
            data={pieData}
            showText
            showGradient
            textColorClassName="text-fg/80"
            radius={100}
            textSize={10}
            textBackgroundRadius={26}
            centerLabelComponent={() => <Text className="text-fg/60 text-sm">{totalAmount}</Text>}
          />
        </View>
      )}

      <AmortizationTable amortizationSchedule={amortizationSchedule} />
    </ScrollView>
  );
};

export default EMICalculator;
