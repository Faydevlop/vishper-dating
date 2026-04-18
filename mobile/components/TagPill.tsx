import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";

type TagPillProps = {
  label: string;
};

export function TagPill({ label }: TagPillProps) {
  return (
    <View style={styles.pill}>
      <Text numberOfLines={1} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(179, 157, 219, 0.36)",
    backgroundColor: "rgba(179, 157, 219, 0.14)",
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  text: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
});
