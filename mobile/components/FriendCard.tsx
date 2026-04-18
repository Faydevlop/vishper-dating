import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { TagPill } from "@/components/TagPill";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import type { FriendProfile } from "@/src/types/models";
import { hapticLight } from "@/src/utils/haptics";

type FriendCardProps = {
  friend: FriendProfile;
  onCallPress?: (friend: FriendProfile) => void;
};

export function FriendCard({ friend, onCallPress }: FriendCardProps) {
  return (
    <View style={styles.card}>
      <AvatarCircle color={friend.avatarColor} name={friend.name} showOnline={friend.isOnline} size={46} />
      <View style={styles.main}>
        <Text numberOfLines={1} style={styles.name}>
          {friend.name}
        </Text>
        <Text style={styles.status}>{friend.isOnline ? "Online now" : friend.lastSeen}</Text>
        <View style={styles.tagsRow}>
          {friend.tags.slice(0, 2).map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </View>
      </View>
      <Pressable
        onPress={() => {
          hapticLight();
          onCallPress?.(friend);
        }}
        style={({ pressed }) => [styles.callButton, pressed && styles.callPressed]}
      >
        <Ionicons color={COLORS.textPrimary} name="call" size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26, 26, 46, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  status: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.body,
  },
  tagsRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  callButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  callPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});
