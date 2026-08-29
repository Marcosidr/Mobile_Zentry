import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';

type IconButtonProps = {
  icon: ReactNode;
  onPress: () => void;
  label: string;
};

export function IconButton({ icon, onPress, label }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

