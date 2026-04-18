import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import type { CallHistoryEntry } from "@/src/types/models";

type CallRowProps = {
  item: CallHistoryEntry;
};

const iconMap = {
  incoming: "arrow-down-circle",
  outgoing: "arrow-up-circle",
  missed: "close-circle",
} as const;

const colorMap = {
  incoming: COLORS.incoming,
  outgoing: COLORS.outgoing,
  missed: COLORS.danger,
} as const;

export function CallRow({ item }: CallRowProps) {
  return (
    <View style={styles.row}>
      <AvatarCircle color={item.callerColor} name={item.callerName} size={44} />
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {item.callerName}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons color={colorMap[item.direction]} name={iconMap[item.direction]} size={14} style={styles.icon} />
          <Text style={[styles.metaText, { color: colorMap[item.direction] }]}>{item.direction}</Text>
          <Text style={styles.metaText}>• {item.duration}</Text>
        </View>
      </View>
      <Text style={styles.time}>{item.timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26, 26, 46, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  metaRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    flexShrink: 0,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.body,
    textTransform: "capitalize",
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.body,
    textAlign: "right",
    maxWidth: 84,
  },
});
