import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { COLORS, FONT_FAMILY, GRADIENTS } from "@/src/theme/tokens";

export default function OnboardingScreen() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [floatAnim]);

  const orbTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 24],
  });

  const orbTranslateX = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -20],
  });

  return (
    <LinearGradient colors={GRADIENTS.darkBackdrop} style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.orbOne, { transform: [{ translateY: orbTranslateY }] }]} />
        <Animated.View style={[styles.orbTwo, { transform: [{ translateX: orbTranslateX }, { translateY: orbTranslateY }] }]} />
        <View style={styles.dotField}>
          {Array.from({ length: 22 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  left: `${(index * 13) % 100}%`,
                  top: `${(index * 29) % 100}%`,
                  opacity: 0.12 + (index % 4) * 0.08,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.centerContent}>
          <View style={styles.logoWrap}>
            <Ionicons color={COLORS.textPrimary} name="mic" size={42} />
          </View>
          <Text style={styles.title}>Whisper</Text>
          <Text style={styles.tagline}>Real voices. Real connections.</Text>
        </View>

        <View style={styles.ctaWrap}>
          <PrimaryButton label="Get Started" onPress={() => router.push("/auth/signup")} />
          <PrimaryButton label="Log In" onPress={() => router.push("/auth/login")} variant="outline" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safe: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 20,
    overflow: "hidden",
  },
  centerContent: {
    marginTop: 52,
    alignItems: "center",
  },
  logoWrap: {
    width: 114,
    height: 114,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(108,63,197,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 26,
    elevation: 8,
  },
  title: {
    marginTop: 22,
    color: COLORS.textPrimary,
    fontSize: 44,
    lineHeight: 48,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -1.2,
  },
  tagline: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.body,
    textAlign: "center",
  },
  ctaWrap: {
    gap: 12,
  },
  orbOne: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(108,63,197,0.25)",
    top: -90,
    right: -50,
  },
  orbTwo: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: "rgba(179,157,219,0.18)",
    bottom: 120,
    left: -70,
  },
  dotField: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.secondary,
  },
});
