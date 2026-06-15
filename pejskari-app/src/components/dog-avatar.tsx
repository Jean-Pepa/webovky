import { StyleSheet, Text, View } from 'react-native';

import type { Dog } from '@/types';

/** Kolečko s barvou a emoji avatarem psa. */
export function DogAvatar({ dog, size = 56 }: { dog: Pick<Dog, 'avatar' | 'color'>; size?: number }) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: dog.color },
      ]}>
      <Text style={{ fontSize: size * 0.5 }}>{dog.avatar}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
