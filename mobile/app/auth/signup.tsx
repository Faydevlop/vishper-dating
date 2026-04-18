import { useMemo, useState } from "react";
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
import { INTEREST_TAGS } from "@/data/users";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import type { UserGender } from "@/src/types/models";
import { hapticSelection } from "@/src/utils/haptics";

const GENDER_OPTIONS: UserGender[] = ["Man", "Woman", "Non-binary", "Prefer not to say"];

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<UserGender>("Prefer not to say");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Random Chat"]);
  const [focusedField, setFocusedField] = useState<"phone" | "name" | "age" | null>(null);

  const stepProgress = useMemo(() => (step === 1 ? "50%" : "100%"), [step]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
    hapticSelection();
  };

  const continueFromStepOne = () => {
    setStep(2);
  };

  const completeSignup = () => {
    router.push({
      pathname: "/auth/otp",
      params: {
        phone: `+91 ${phone || "98765 43210"}`,
      },
    });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Reveal>
            <View style={styles.progressWrap}>
              <Text style={styles.progressLabel}>Step {step} of 2</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: stepProgress }]} />
              </View>
            </View>
          </Reveal>

          <Reveal delay={40}>
            <View style={styles.card}>
              {step === 1 ? (
                <>
                  <Text style={styles.title}>Create your account</Text>
                  <Text style={styles.subtitle}>Start with your phone number</Text>

                  <View style={[styles.phoneWrap, focusedField === "phone" && styles.focusedInput]}>
                    <Pressable style={styles.countryCode}>
                      <Text style={styles.countryText}>+91</Text>
                      <Ionicons color={COLORS.textSecondary} name="chevron-down" size={14} />
                    </Pressable>
                    <TextInput
                      keyboardType="phone-pad"
                      onBlur={() => setFocusedField(null)}
                      onChangeText={setPhone}
                      onFocus={() => setFocusedField("phone")}
                      placeholder="Phone number"
                      placeholderTextColor={COLORS.textSecondary}
                      style={styles.input}
                      value={phone}
                    />
                  </View>

                  <PrimaryButton label="Continue" onPress={continueFromStepOne} />
                </>
              ) : (
                <>
                  <Text style={styles.title}>Tell us about you</Text>
                  <Text style={styles.subtitle}>We will use this for better voice matches</Text>

                  <TextInput
                    onBlur={() => setFocusedField(null)}
                    onChangeText={setDisplayName}
                    onFocus={() => setFocusedField("name")}
                    placeholder="Display name"
                    placeholderTextColor={COLORS.textSecondary}
                    style={[styles.stackedInput, focusedField === "name" && styles.focusedInput]}
                    value={displayName}
                  />

                  <TextInput
                    keyboardType="number-pad"
                    onBlur={() => setFocusedField(null)}
                    onChangeText={setAge}
                    onFocus={() => setFocusedField("age")}
                    placeholder="Age"
                    placeholderTextColor={COLORS.textSecondary}
                    style={[styles.stackedInput, focusedField === "age" && styles.focusedInput]}
                    value={age}
                  />

                  <View style={styles.groupWrap}>
                    <Text style={styles.groupLabel}>Gender</Text>
                    <View style={styles.optionWrap}>
                      {GENDER_OPTIONS.map((option) => (
                        <Pressable
                          key={option}
                          onPress={() => {
                            setGender(option);
                            hapticSelection();
                          }}
                          style={({ pressed }) => [styles.option, gender === option && styles.optionActive, pressed && styles.optionPressed]}
                        >
                          <Text style={[styles.optionText, gender === option && styles.optionTextActive]}>{option}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View style={styles.groupWrap}>
                    <Text style={styles.groupLabel}>Interests</Text>
                    <View style={styles.optionWrap}>
                      {INTEREST_TAGS.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <Pressable
                            key={tag}
                            onPress={() => toggleTag(tag)}
                            style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.optionPressed]}
                          >
                            <Text style={[styles.optionText, active && styles.optionTextActive]}>{tag}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <PrimaryButton label="Continue" onPress={completeSignup} />
                </>
              )}
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
    padding: 20,
    gap: 14,
    paddingBottom: 28,
  },
  progressWrap: {
    gap: 8,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  progressTrack: {
    height: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },
  card: {
    borderRadius: RADIUS.xl,
    backgroundColor: "rgba(26,26,46,0.82)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.22)",
    padding: 20,
    gap: 14,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    lineHeight: 30,
    fontFamily: FONT_FAMILY.heading,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.body,
    marginBottom: 4,
  },
  phoneWrap: {
    minHeight: 52,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(13,13,13,0.8)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.24)",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  countryCode: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: FONT_FAMILY.body,
  },
  stackedInput: {
    minHeight: 52,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(13,13,13,0.8)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.24)",
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: FONT_FAMILY.body,
  },
  focusedInput: {
    borderColor: COLORS.primary,
  },
  groupWrap: {
    gap: 9,
  },
  groupLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.28)",
    backgroundColor: "rgba(179,157,219,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(108,63,197,0.28)",
  },
  optionPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  optionTextActive: {
    color: COLORS.textPrimary,
  },
});
