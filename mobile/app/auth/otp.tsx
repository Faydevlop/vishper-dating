import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OTPInput } from "@/components/OTPInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Reveal } from "@/components/Reveal";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticSuccess } from "@/src/utils/haptics";

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone ?? "+91 98765 43210";

  const [countdown, setCountdown] = useState(45);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const triggerVerify = (codeOverride?: string) => {
    const code = codeOverride ?? otpCode;
    if (verifying || code.length < 6) {
      return;
    }

    setVerifying(true);
    hapticSuccess();
    setTimeout(() => {
      router.replace("/(tabs)/explore");
    }, 650);
  };

  const resendText = useMemo(() => `Resend in 0:${String(countdown).padStart(2, "0")}`, [countdown]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Reveal>
            <View style={styles.card}>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>Sent to {phone}</Text>

              <OTPInput
                onChangeCode={setOtpCode}
                onComplete={(code) => {
                  setOtpCode(code);
                  setTimeout(() => {
                    triggerVerify(code);
                  }, 180);
                }}
              />

              <Text style={styles.resendText}>{countdown > 0 ? resendText : "Resend OTP"}</Text>

              <PrimaryButton
                disabled={otpCode.length < 6 || verifying}
                label={verifying ? "Verifying..." : "Verify"}
                onPress={() => triggerVerify()}
              />
            </View>
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
    paddingBottom: 20,
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
    fontSize: 28,
    lineHeight: 32,
    fontFamily: FONT_FAMILY.heading,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: FONT_FAMILY.body,
  },
  resendText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
    textAlign: "center",
  },
});
