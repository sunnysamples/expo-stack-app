import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import CustomHeader from '@/components/CustomHeader';
import { ScreenContent } from '@/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Tab One" />,
        }}
      />
      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/index.tsx" title="Tab One" />
      </Container>
    </>
  );
}
