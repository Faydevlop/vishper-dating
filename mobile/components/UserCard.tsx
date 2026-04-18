import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { TagPill } from "@/components/TagPill";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import type { UserProfile } from "@/src/types/models";
import { hapticLight } from "@/src/utils/haptics";

type UserCardProps = {
  user: UserProfile;
  onCallPress?: (user: UserProfile) => void;
};

export function UserCard({ user, onCallPress }: UserCardProps) {
  const tags = user.tags.slice(0, 2);
  const busy = user.isInCall;

  return (
    <BlurView intensity={22} tint="dark" experimentalBlurMethod="dimezisBlurView" style={styles.blurWrap}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <AvatarCircle color={user.avatarColor} name={user.name} showOnline={user.isOnline && !busy} size={46} />
          <View style={styles.statusWrap}>
            {busy ? (
              <View style={[styles.statusPill, styles.statusBusy]}>
                <Ionicons color={COLORS.textPrimary} name="lock-closed" size={11} />
                <Text style={styles.statusText}>In a call</Text>
              </View>
            ) : user.isOnline ? (
              <View style={[styles.statusPill, styles.statusOnline]}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            ) : (
              <View style={[styles.statusPill, styles.statusOffline]}>
                <Text style={styles.statusText}>Away</Text>
              </View>
            )}
          </View>
        </View>

        <Text numberOfLines={1} style={styles.name}>
          {user.name}
        </Text>
        <Text style={styles.age}>{user.age} yrs</Text>

        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </View>

        <Pressable
          disabled={busy}
          onPress={() => {
            hapticLight();
            onCallPress?.(user);
          }}
          style={({ pressed }) => [styles.callButton, busy && styles.callButtonDisabled, pressed && !busy && styles.callButtonPressed]}
        >
          <Ionicons color={COLORS.textPrimary} name="mic" size={15} />
          <Text style={styles.callButtonText}>{busy ? "Busy" : "Call"}</Text>
        </Pressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurWrap: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  card: {
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26, 26, 46, 0.68)",
    padding: 12,
    minHeight: 182,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  statusWrap: {
    flexShrink: 1,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  statusOnline: {
    backgroundColor: "rgba(0, 230, 118, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(0, 230, 118, 0.26)",
  },
  statusBusy: {
    backgroundColor: "rgba(255, 79, 129, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 79, 129, 0.35)",
  },
  statusOffline: {
    backgroundColor: "rgba(160, 160, 176, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(160, 160, 176, 0.35)",
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: COLORS.online,
  },
  statusText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    lineHeight: 12,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  name: {
    marginTop: 10,
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.heading,
  },
  age: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.body,
  },
  tagsRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    minHeight: 26,
  },
  callButton: {
    marginTop: 12,
    minHeight: 36,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  callButtonDisabled: {
    backgroundColor: "rgba(160,160,176,0.24)",
    borderColor: "rgba(160,160,176,0.35)",
  },
  callButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  callButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 15,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
});
