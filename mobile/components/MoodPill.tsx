import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticSelection } from "@/src/utils/haptics";

type MoodPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function MoodPill({ label, selected, onPress }: MoodPillProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      speed: 30,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => {
          hapticSelection();
          onPress();
        }}
        onPressIn={() => animate(0.98)}
        onPressOut={() => animate(1)}
        style={({ pressed }) => [styles.base, selected && styles.active, pressed && styles.pressed]}
      >
        <Text style={[styles.label, selected && styles.labelActive]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(179, 157, 219, 0.3)",
    backgroundColor: "rgba(179, 157, 219, 0.08)",
  },
  active: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(108, 63, 197, 0.26)",
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  labelActive: {
    color: COLORS.textPrimary,
  },
});
