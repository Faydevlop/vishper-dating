import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Reveal } from "@/components/Reveal";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticSelection } from "@/src/utils/haptics";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Reveal>
            <View style={styles.logoWrap}>
              <Ionicons color={COLORS.textPrimary} name="mic" size={20} />
            </View>
          </Reveal>

          <Reveal delay={40}>
            <View style={styles.card}>
              <Text style={styles.title}>Welcome back</Text>

              <View style={[styles.phoneWrap, isFocused && styles.phoneWrapFocused]}>
                <Pressable style={styles.countryCode}>
                  <Text style={styles.countryText}>+91</Text>
                  <Ionicons color={COLORS.textSecondary} name="chevron-down" size={14} />
                </Pressable>
                <TextInput
                  keyboardType="phone-pad"
                  onBlur={() => setIsFocused(false)}
                  onChangeText={setPhone}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Phone number"
                  placeholderTextColor={COLORS.textSecondary}
                  style={styles.input}
                  value={phone}
                />
              </View>

              <View style={styles.buttonWrap}>
                <PrimaryButton
                  label="Send OTP"
                  onPress={() => router.push({ pathname: "/auth/otp", params: { phone: `+91 ${phone || "98765 43210"}` } })}
                />
              </View>
            </View>
          </Reveal>

          <Reveal delay={80}>
            <Pressable
              onPress={() => {
                hapticSelection();
                router.push("/auth/signup");
              }}
              style={styles.linkWrap}
            >
              <Text style={styles.linkText}>
                New here? <Text style={styles.linkStrong}>Sign up</Text>
              </Text>
            </Pressable>
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 22,
    gap: 20,
  },
  logoWrap: {
    alignSelf: "center",
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(108,63,197,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: RADIUS.xl,
    backgroundColor: "rgba(26,26,46,0.82)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.2)",
    padding: 20,
    gap: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 27,
    lineHeight: 31,
    fontFamily: FONT_FAMILY.heading,
  },
  phoneWrap: {
    minHeight: 52,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(13,13,13,0.8)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.22)",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  phoneWrapFocused: {
    borderColor: COLORS.primary,
  },
  countryCode: {
    paddingHorizontal: 12,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: "rgba(179,157,219,0.2)",
  },
  countryText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  input: {
    flex: 1,
    minHeight: 52,
    color: COLORS.textPrimary,
    fontSize: 15,
    paddingHorizontal: 12,
    fontFamily: FONT_FAMILY.body,
  },
  buttonWrap: {
    marginTop: 4,
  },
  linkWrap: {
    alignSelf: "center",
  },
  linkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.body,
  },
  linkStrong: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
});
