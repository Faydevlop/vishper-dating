import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Reveal } from "@/components/Reveal";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticLight, hapticSuccess } from "@/src/utils/haptics";

export default function CallFeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatarColor?: string;
    duration?: string;
  }>();

  const name = typeof params.name === "string" && params.name.trim().length ? params.name : "this person";
  const avatarColor = typeof params.avatarColor === "string" && params.avatarColor.trim().length ? params.avatarColor : COLORS.primary;
  const duration = typeof params.duration === "string" && params.duration.trim().length ? params.duration : "00:00";
  const personId = typeof params.id === "string" ? params.id : "unknown";

  const [rating, setRating] = useState(0);
  const [reason, setReason] = useState("");

  const submitFeedback = () => {
    hapticSuccess();
    Alert.alert("Feedback submitted", "Thanks for helping keep Whisper conversations better.", [
      {
        text: "Back to app",
        onPress: () => {
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
            <Text style={styles.title}>Rate Your Call</Text>
            <Text style={styles.subtitle}>How was your conversation with {name}?</Text>
          </View>
        </Reveal>

        <Reveal delay={30}>
          <View style={styles.profileCard}>
            <AvatarCircle color={avatarColor} name={name} size={70} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.callInfo}>Call duration: {duration}</Text>
          </View>
        </Reveal>

        <Reveal delay={55}>
          <View style={styles.starsWrap}>
            {Array.from({ length: 5 }).map((_, index) => {
              const star = index + 1;
              const active = star <= rating;

              return (
                <Pressable
                  key={star}
                  onPress={() => {
                    hapticLight();
                    setRating(star);
                  }}
                  style={({ pressed }) => [styles.starButton, pressed && styles.pressed]}
                >
                  <Ionicons color={active ? "#FFD166" : "rgba(255,255,255,0.28)"} name={active ? "star" : "star-outline"} size={34} />
                </Pressable>
              );
            })}
          </View>
        </Reveal>

        <Reveal delay={75}>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Reason (optional)</Text>
            <TextInput
              multiline
              onChangeText={setReason}
              placeholder="Tell us what went well or what felt off..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.reasonInput}
              value={reason}
            />
          </View>
        </Reveal>

        <Reveal delay={95}>
          <View style={styles.actions}>
            <PrimaryButton disabled={rating === 0} label="Submit Feedback" onPress={submitFeedback} />
            <PrimaryButton
              label="Report This Person"
              onPress={() => {
                router.push({
                  pathname: "/call/report",
                  params: {
                    id: personId,
                    name,
                    avatarColor,
                  },
                });
              }}
              variant="outline"
            />
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
  profileCard: {
    borderRadius: RADIUS.xl,
    backgroundColor: "rgba(26,26,46,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 18,
    alignItems: "center",
    gap: 8,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.heading,
  },
  callInfo: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.body,
  },
  starsWrap: {
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26,26,46,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  starButton: {
    padding: 2,
  },
  inputWrap: {
    gap: 8,
  },
  inputLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  reasonInput: {
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
    transform: [{ scale: 0.96 }],
  },
});
