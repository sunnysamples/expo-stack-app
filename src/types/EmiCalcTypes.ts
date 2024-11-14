interface AmortizationScheduleItem {
  month: number;
  emi: string;
  principalPayment: string;
  interest: string;
  balance: string;
}

type AmortizationSchedule = AmortizationScheduleItem[];

export type { AmortizationSchedule, AmortizationScheduleItem };
