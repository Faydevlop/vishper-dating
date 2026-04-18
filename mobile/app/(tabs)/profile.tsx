import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Reveal } from "@/components/Reveal";
import { DUMMY_USERS, INTEREST_TAGS } from "@/data/users";
import { DUMMY_FRIENDS } from "@/data/friends";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticLight, hapticSelection, hapticWarning } from "@/src/utils/haptics";

type SettingRow = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  danger?: boolean;
};

const SETTINGS: SettingRow[] = [
  { key: "notifications", icon: "notifications-outline", label: "Notifications" },
  { key: "privacy", icon: "shield-checkmark-outline", label: "Privacy" },
  { key: "blocked", icon: "ban-outline", label: "Blocked Users" },
  { key: "credits", icon: "wallet-outline", label: "Recharge / Credits", value: "₹0.00" },
  { key: "help", icon: "help-circle-outline", label: "Help & Support" },
  { key: "about", icon: "information-circle-outline", label: "About Whisper" },
  { key: "logout", icon: "log-out-outline", label: "Log Out", danger: true },
];

export default function ProfileScreen() {
  const profile = DUMMY_USERS[0];
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.tags);

  const stats = useMemo(
    () => [
      { label: "Total Calls", value: profile.totalCalls },
      { label: "Minutes Talked", value: profile.minutesTalked },
      { label: "Friends", value: DUMMY_FRIENDS.length },
    ],
    [profile],
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
    hapticSelection();
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal>
          <View style={styles.headerWrap}>
            <AvatarCircle color={COLORS.primary} name={profile.name} size={102} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age} years old</Text>
            <Pressable
              onPress={() => hapticLight()}
              style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>
        </Reveal>

        <Reveal delay={35}>
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Reveal>

        <Reveal delay={65}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionSubtitle}>Tap to edit what you are into</Text>
          </View>
        </Reveal>

        <View style={styles.tagsWrap}>
          {INTEREST_TAGS.map((tag, index) => {
            const active = selectedTags.includes(tag);
            return (
              <Reveal delay={85 + index * 24} key={tag}>
                <Pressable onPress={() => toggleTag(tag)} style={({ pressed }) => [styles.tagChip, active && styles.tagChipActive, pressed && styles.buttonPressed]}>
                  <Text style={[styles.tagChipText, active && styles.tagChipTextActive]}>{tag}</Text>
                </Pressable>
              </Reveal>
            );
          })}
        </View>

        <Reveal delay={120}>
          <View style={styles.settingsWrap}>
            {SETTINGS.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => {
                  if (item.danger) {
                    hapticWarning();
                  } else {
                    hapticSelection();
                  }
                }}
                style={({ pressed }) => [styles.settingRow, pressed && styles.buttonPressed]}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconWrap, item.danger && styles.settingIconDanger]}>
                    <Ionicons color={item.danger ? COLORS.danger : COLORS.secondary} name={item.icon} size={17} />
                  </View>
                  <Text style={[styles.settingText, item.danger && styles.settingTextDanger]}>{item.label}</Text>
                </View>
                <View style={styles.settingRight}>
                  {item.value ? <Text style={styles.settingValue}>{item.value}</Text> : null}
                  <Ionicons color={item.danger ? COLORS.danger : COLORS.textSecondary} name="chevron-forward" size={16} />
                </View>
              </Pressable>
            ))}
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
  headerWrap: {
    marginTop: 8,
    alignItems: "center",
    gap: 8,
  },
  name: {
    marginTop: 6,
    color: COLORS.textPrimary,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -0.5,
  },
  age: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.body,
  },
  editButton: {
    marginTop: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "rgba(108,63,197,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 15,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26,26,46,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 17,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.heading,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.body,
    textAlign: "center",
  },
  sectionHeader: {
    marginTop: 4,
    gap: 3,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.heading,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.body,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.3)",
    backgroundColor: "rgba(179,157,219,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(108,63,197,0.24)",
  },
  tagChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  tagChipTextActive: {
    color: COLORS.textPrimary,
  },
  settingsWrap: {
    marginTop: 6,
    borderRadius: RADIUS.xl,
    backgroundColor: "rgba(26,26,46,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  settingRow: {
    minHeight: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  settingIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(108,63,197,0.14)",
  },
  settingIconDanger: {
    backgroundColor: "rgba(255,90,106,0.15)",
  },
  settingText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.body,
  },
  settingTextDanger: {
    color: COLORS.danger,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
