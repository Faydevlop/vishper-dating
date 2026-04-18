import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_FAMILY } from "@/src/theme/tokens";
import { getInitials } from "@/src/utils/time";

type AvatarCircleProps = {
  name: string;
  size?: number;
  color?: string;
  showOnline?: boolean;
};

export function AvatarCircle({ name, size = 48, color = COLORS.primary, showOnline = false }: AvatarCircleProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}> 
      <View style={[styles.avatar, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}> 
        <Text style={[styles.initials, { fontSize: Math.max(12, size * 0.33) }]}>{getInitials(name)}</Text>
      </View>
      {showOnline ? <View style={[styles.onlineDot, { right: size * 0.03, bottom: size * 0.03 }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  initials: {
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.bodyStrong,
    letterSpacing: 0.3,
  },
  onlineDot: {
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: 999,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
});
