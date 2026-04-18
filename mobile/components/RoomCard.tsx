import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import type { RoomEntry } from "@/src/types/models";
import { hapticLight } from "@/src/utils/haptics";

type RoomCardProps = {
  room: RoomEntry;
  onPress?: (room: RoomEntry) => void;
};

export function RoomCard({ room, onPress }: RoomCardProps) {
  return (
    <Pressable
      onPress={() => {
        hapticLight();
        onPress?.(room);
      }}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <BlurView intensity={24} tint="dark" experimentalBlurMethod="dimezisBlurView" style={styles.blurWrap}>
        <View style={styles.card}>
          <Text numberOfLines={1} style={styles.name}>
            {room.name}
          </Text>
          <Text numberOfLines={1} style={styles.host}>
            Host: {room.host}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons color={COLORS.textSecondary} name="headset" size={13} />
              <Text style={styles.metaText}>{room.listeners}</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{room.tag}</Text>
            </View>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 220,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  blurWrap: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: 14,
    minHeight: 110,
    backgroundColor: "rgba(26, 26, 46, 0.68)",
    justifyContent: "space-between",
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.heading,
  },
  host: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.body,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  tagPill: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(108,63,197,0.24)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.4)",
  },
  tagText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
});
