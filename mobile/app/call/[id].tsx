import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Reveal } from "@/components/Reveal";
import { TagPill } from "@/components/TagPill";
import { COLORS, FONT_FAMILY, GRADIENTS, RADIUS } from "@/src/theme/tokens";
import { hapticLight, hapticSuccess, hapticWarning } from "@/src/utils/haptics";

export default function CallSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatarColor?: string;
    age?: string;
    tags?: string;
  }>();

  const name = typeof params.name === "string" && params.name.trim().length ? params.name : "Anonymous Voice";
  const avatarColor = typeof params.avatarColor === "string" && params.avatarColor.trim().length ? params.avatarColor : COLORS.primary;
  const age = typeof params.age === "string" && params.age.trim().length ? params.age : "";
  const tags = useMemo(() => {
    if (typeof params.tags !== "string" || !params.tags.length) {
      return [] as string[];
    }

    return params.tags
      .split("|")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [params.tags]);

  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const callTimer = useMemo(() => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [seconds]);

  const endCall = () => {
    hapticWarning();
    router.replace({
      pathname: "/call/feedback",
      params: {
        id: typeof params.id === "string" ? params.id : "unknown",
        name,
        avatarColor,
        duration: callTimer,
      },
    });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal>
          <View style={styles.topRow}>
            <Pressable
              onPress={() => {
                hapticLight();
                router.back();
              }}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Ionicons color={COLORS.textPrimary} name="chevron-back" size={20} />
            </Pressable>
            <Text style={styles.pageTitle}>In Call</Text>
            <View style={styles.backButtonSpacer} />
          </View>
        </Reveal>

        <Reveal delay={30}>
          <LinearGradient colors={GRADIENTS.callActive} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.heroCard}>
            <AvatarCircle color={avatarColor} name={name} size={88} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.metaText}>{age ? `${age} yrs` : "Voice only profile"}</Text>
            <Text style={styles.timer}>{callTimer}</Text>
          </LinearGradient>
        </Reveal>

        {tags.length ? (
          <Reveal delay={55}>
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </View>
          </Reveal>
        ) : null}

        <Reveal delay={80}>
          <View style={styles.controlsRow}>
            <Pressable
              onPress={() => {
                hapticLight();
                setIsMuted((current) => !current);
              }}
              style={({ pressed }) => [styles.controlButton, isMuted && styles.controlButtonActive, pressed && styles.pressed]}
            >
              <Ionicons color={COLORS.textPrimary} name={isMuted ? "mic-off" : "mic"} size={18} />
              <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                hapticLight();
                setSpeakerOn((current) => !current);
              }}
              style={({ pressed }) => [styles.controlButton, speakerOn && styles.controlButtonActive, pressed && styles.pressed]}
            >
              <Ionicons color={COLORS.textPrimary} name={speakerOn ? "volume-high" : "volume-medium"} size={18} />
              <Text style={styles.controlText}>{speakerOn ? "Speaker On" : "Speaker"}</Text>
            </Pressable>
          </View>
        </Reveal>

        <Reveal delay={105}>
          <View style={styles.actions}>
            <PrimaryButton
              label={requestSent ? "Friend Request Sent" : "Send Friend Request"}
              onPress={() => {
                if (requestSent) {
                  return;
                }

                hapticSuccess();
                setRequestSent(true);
              }}
              iconName={requestSent ? "checkmark-circle" : "person-add"}
              disabled={requestSent}
            />

            <Pressable onPress={endCall} style={({ pressed }) => [styles.endButtonWrap, pressed && styles.pressed]}>
              <LinearGradient colors={GRADIENTS.callActive} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.endButton}>
                <Ionicons color={COLORS.textPrimary} name="call" size={16} />
                <Text style={styles.endButtonText}>End Call</Text>
              </LinearGradient>
            </Pressable>
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
    paddingBottom: 26,
    gap: 14,
  },
  topRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(26,26,46,0.76)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonSpacer: {
    width: 38,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.heading,
  },
  heroCard: {
    marginTop: 8,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  name: {
    marginTop: 12,
    color: COLORS.textPrimary,
    fontSize: 27,
    lineHeight: 31,
    fontFamily: FONT_FAMILY.heading,
  },
  metaText: {
    marginTop: 5,
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.body,
  },
  timer: {
    marginTop: 10,
    color: COLORS.textPrimary,
    fontSize: 26,
    lineHeight: 30,
    fontFamily: FONT_FAMILY.bodyStrong,
    letterSpacing: 1.1,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
  },
  controlButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.32)",
    backgroundColor: "rgba(26,26,46,0.7)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  controlButtonActive: {
    borderColor: "rgba(255,79,129,0.65)",
    backgroundColor: "rgba(255,79,129,0.2)",
  },
  controlText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  actions: {
    gap: 12,
  },
  endButtonWrap: {
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  endButton: {
    minHeight: 54,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  endButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});
