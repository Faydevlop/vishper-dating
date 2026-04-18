import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { CallRow } from "@/components/CallRow";
import { Reveal } from "@/components/Reveal";
import { DUMMY_CALLS } from "@/data/calls";
import { DUMMY_USERS } from "@/data/users";
import { COLORS, FONT_FAMILY, GRADIENTS, RADIUS } from "@/src/theme/tokens";
import { hapticLight, hapticMedium, hapticWarning } from "@/src/utils/haptics";

export default function CallsScreen() {
  const router = useRouter();
  const [inActiveCall] = useState(true);
  const [seconds, setSeconds] = useState(4 * 60 + 32);

  useEffect(() => {
    if (!inActiveCall) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [inActiveCall]);

  const callTimer = useMemo(() => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [seconds]);

  const openCallScreen = (user: (typeof DUMMY_USERS)[number]) => {
    router.push({
      pathname: "/call/[id]",
      params: {
        id: user.id,
        name: user.name,
        avatarColor: user.avatarColor,
        age: String(user.age),
        tags: user.tags.join("|"),
      },
    });
  };

  const openFeedbackScreen = () => {
    router.push({
      pathname: "/call/feedback",
      params: {
        id: "live_mia_sol",
        name: "Mia Sol",
        avatarColor: "#FF9EB8",
      },
    });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Reveal>
            <Text style={styles.title}>Calls</Text>
          </Reveal>

          {inActiveCall ? (
            <Reveal delay={40}>
              <LinearGradient colors={GRADIENTS.callActive} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.activeCard}>
                <View style={styles.activeTop}>
                  <AvatarCircle color="#FF9EB8" name="Mia Sol" size={54} />
                  <View style={styles.activeInfo}>
                    <Text style={styles.activeLabel}>Live with</Text>
                    <Text style={styles.activeName}>Mia Sol</Text>
                  </View>
                  <Text style={styles.timer}>{callTimer}</Text>
                </View>

                <View style={styles.controlsRow}>
                  <CircleControl icon="mic-off" label="Mute" onPress={() => hapticLight()} />
                  <CircleControl icon="volume-high" label="Speaker" onPress={() => hapticLight()} />
                  <CircleControl
                    danger
                    icon="call"
                    label="End"
                    onPress={() => {
                      hapticWarning();
                      openFeedbackScreen();
                    }}
                  />
                </View>
              </LinearGradient>
            </Reveal>
          ) : null}

          <Reveal delay={70}>
            <Text style={styles.sectionTitle}>Recent Calls</Text>
          </Reveal>

          <View style={styles.listWrap}>
            {DUMMY_CALLS.map((item, index) => (
              <Reveal delay={95 + index * 36} key={item.id}>
                <CallRow item={item} />
              </Reveal>
            ))}
          </View>
        </ScrollView>

        <Pressable
          onPress={() => {
            hapticMedium();
            const availableUsers = DUMMY_USERS.filter((user) => user.isOnline && !user.isInCall);
            if (!availableUsers.length) {
              return;
            }

            const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            openCallScreen(randomUser);
          }}
          style={({ pressed }) => [styles.fabWrap, pressed && styles.fabPressed]}
        >
          <LinearGradient colors={GRADIENTS.primaryCta} style={styles.fabGradient}>
            <Ionicons color={COLORS.textPrimary} name="mic" size={18} />
            <Text style={styles.fabText}>Quick Match</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function CircleControl({
  icon,
  label,
  danger = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.controlWrap, danger && styles.controlDanger, pressed && styles.controlPressed]}>
      <Ionicons color={COLORS.textPrimary} name={icon} size={16} />
      <Text style={styles.controlText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 96,
    gap: 14,
  },
  title: {
    marginTop: 8,
    color: COLORS.textPrimary,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -0.5,
  },
  activeCard: {
    borderRadius: RADIUS.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  activeTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activeInfo: {
    flex: 1,
    minWidth: 0,
  },
  activeLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.body,
  },
  activeName: {
    marginTop: 3,
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.heading,
  },
  timer: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  controlsRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  controlWrap: {
    flex: 1,
    minHeight: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(13,13,13,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  controlDanger: {
    backgroundColor: "rgba(13,13,13,0.38)",
    borderColor: "rgba(255,255,255,0.35)",
  },
  controlPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  controlText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  sectionTitle: {
    marginTop: 4,
    color: COLORS.textPrimary,
    fontSize: 17,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.heading,
  },
  listWrap: {
    gap: 10,
  },
  fabWrap: {
    position: "absolute",
    right: 16,
    bottom: 22,
    borderRadius: RADIUS.pill,
    overflow: "hidden",
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  fabGradient: {
    minHeight: 52,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  fabText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  fabPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.97 }],
  },
});
