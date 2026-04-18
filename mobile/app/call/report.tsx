import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Reveal } from "@/components/Reveal";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticLight, hapticSuccess, hapticWarning } from "@/src/utils/haptics";

const REPORT_OPTIONS = [
  "Rude person",
  "Harassment",
  "Spam / Scam",
  "Inappropriate language",
  "Fake profile",
  "Other",
] as const;

export default function CallReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatarColor?: string;
  }>();

  const name = typeof params.name === "string" && params.name.trim().length ? params.name : "this person";
  const avatarColor = typeof params.avatarColor === "string" && params.avatarColor.trim().length ? params.avatarColor : COLORS.primary;
  const [selectedReason, setSelectedReason] = useState<(typeof REPORT_OPTIONS)[number] | "">("");
  const [details, setDetails] = useState("");

  const submitReport = () => {
    hapticWarning();
    Alert.alert("Report submitted", "Thanks. Our moderation team will review this conversation.", [
      {
        text: "Back to app",
        onPress: () => {
          hapticSuccess();
          router.replace("/(tabs)/explore");
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Reveal>
          <View style={styles.header}>
            <Text style={styles.title}>Report This Person</Text>
            <Text style={styles.subtitle}>Help us keep Whisper safe for everyone.</Text>
          </View>
        </Reveal>

        <Reveal delay={25}>
          <View style={styles.personCard}>
            <AvatarCircle color={avatarColor} name={name} size={62} />
            <Text style={styles.personName}>{name}</Text>
          </View>
        </Reveal>

        <Reveal delay={50}>
          <View style={styles.reasonsWrap}>
            <Text style={styles.sectionLabel}>Select a reason</Text>
            <View style={styles.reasonsList}>
              {REPORT_OPTIONS.map((option) => {
                const active = selectedReason === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      hapticLight();
                      setSelectedReason(option);
                    }}
                    style={({ pressed }) => [styles.reasonChip, active && styles.reasonChipActive, pressed && styles.pressed]}
                  >
                    <Text style={[styles.reasonChipText, active && styles.reasonChipTextActive]}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Reveal>

        <Reveal delay={75}>
          <View style={styles.notesWrap}>
            <Text style={styles.sectionLabel}>Additional details (optional)</Text>
            <TextInput
              multiline
              onChangeText={setDetails}
              placeholder="Share more context if needed..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.notesInput}
              value={details}
            />
          </View>
        </Reveal>

        <Reveal delay={95}>
          <View style={styles.actions}>
            <PrimaryButton disabled={!selectedReason} label="Submit Report" onPress={submitReport} />
            <PrimaryButton label="Back to app" onPress={() => router.replace("/(tabs)/explore")} variant="outline" />
          </View>
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  header: {
    marginTop: 10,
    gap: 6,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -0.6,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: FONT_FAMILY.body,
  },
  personCard: {
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26,26,46,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  personName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  reasonsWrap: {
    gap: 8,
  },
  sectionLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  reasonsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  reasonChip: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.35)",
    backgroundColor: "rgba(26,26,46,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reasonChipActive: {
    borderColor: "rgba(255,79,129,0.65)",
    backgroundColor: "rgba(255,79,129,0.2)",
  },
  reasonChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodySemi,
  },
  reasonChipTextActive: {
    color: COLORS.textPrimary,
  },
  notesWrap: {
    gap: 8,
  },
  notesInput: {
    minHeight: 120,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26,26,46,0.75)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.3)",
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONT_FAMILY.body,
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top",
  },
  actions: {
    gap: 10,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
});
