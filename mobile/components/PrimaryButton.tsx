import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT_FAMILY, GRADIENTS, RADIUS } from "@/src/theme/tokens";
import { hapticLight } from "@/src/utils/haptics";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  variant?: "gradient" | "outline";
  fullWidth?: boolean;
};

export function PrimaryButton({ label, onPress, iconName, disabled = false, variant = "gradient", fullWidth = true }: PrimaryButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scaleAnim, {
      toValue: value,
      speed: 30,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        disabled={disabled}
        onPress={() => {
          hapticLight();
          onPress();
        }}
        onPressIn={() => animateTo(0.98)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [styles.wrap, disabled && styles.disabled, pressed && !disabled && styles.pressed]}
      >
        {variant === "gradient" ? (
          <LinearGradient colors={GRADIENTS.primaryCta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
            <ButtonContent iconName={iconName} label={label} variant={variant} />
          </LinearGradient>
        ) : (
          <View style={styles.outline}>
            <ButtonContent iconName={iconName} label={label} variant={variant} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function ButtonContent({ label, iconName, variant }: { label: string; iconName?: keyof typeof Ionicons.glyphMap; variant: "gradient" | "outline" }) {
  const iconColor = variant === "gradient" ? COLORS.textPrimary : COLORS.primary;
  const textColor = variant === "gradient" ? COLORS.textPrimary : COLORS.primary;

  return (
    <View style={styles.content}>
      {iconName ? <Ionicons color={iconColor} name={iconName} size={18} style={styles.icon} /> : null}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 54,
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  fullWidth: {
    width: "100%",
  },
  gradient: {
    minHeight: 54,
    justifyContent: "center",
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  outline: {
    minHeight: 54,
    justifyContent: "center",
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "rgba(108,63,197,0.07)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.bodyStrong,
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.95,
  },
});
