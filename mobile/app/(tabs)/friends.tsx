import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AvatarCircle } from "@/components/AvatarCircle";
import { FriendCard } from "@/components/FriendCard";
import { Reveal } from "@/components/Reveal";
import { DUMMY_FRIEND_REQUESTS, DUMMY_FRIENDS } from "@/data/friends";
import { DUMMY_USERS } from "@/data/users";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";
import { hapticLight, hapticWarning } from "@/src/utils/haptics";

export default function FriendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredFriends = useMemo(
    () => DUMMY_FRIENDS.filter((friend) => friend.name.toLowerCase().includes(search.trim().toLowerCase())),
    [search],
  );

  const onlineFriends = useMemo(() => DUMMY_FRIENDS.filter((friend) => friend.isOnline), []);

  const openFriendCall = (friend: (typeof DUMMY_FRIENDS)[number]) => {
    const matchedUser = DUMMY_USERS.find((user) => user.name.toLowerCase() === friend.name.toLowerCase());

    router.push({
      pathname: "/call/[id]",
      params: {
        id: friend.id,
        name: friend.name,
        avatarColor: friend.avatarColor,
        age: matchedUser ? String(matchedUser.age) : "",
        tags: friend.tags.join("|"),
      },
    });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal>
          <Text style={styles.title}>Friends</Text>
        </Reveal>

        <Reveal delay={30}>
          <View style={styles.searchWrap}>
            <Ionicons color={COLORS.textSecondary} name="search" size={16} />
            <TextInput
              onChangeText={setSearch}
              placeholder="Search friends"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.searchInput}
              value={search}
            />
          </View>
        </Reveal>

        <Reveal delay={50}>
          <SectionTitle subtitle="People currently available" title="Online Now" />
        </Reveal>
        <ScrollView contentContainerStyle={styles.onlineRow} horizontal showsHorizontalScrollIndicator={false}>
          {onlineFriends.map((friend, index) => (
            <Reveal delay={70 + index * 28} key={friend.id}>
              <View style={styles.onlineItem}>
                <AvatarCircle color={friend.avatarColor} name={friend.name} showOnline size={56} />
                <Text numberOfLines={1} style={styles.onlineName}>
                  {friend.name}
                </Text>
              </View>
            </Reveal>
          ))}
        </ScrollView>

        <Reveal delay={80}>
          <SectionTitle subtitle="Accept or skip" title="Friend Requests" />
        </Reveal>
        <View style={styles.requestList}>
          {DUMMY_FRIEND_REQUESTS.map((request, index) => (
            <Reveal delay={100 + index * 34} key={request.id}>
              <View style={styles.requestCard}>
                <AvatarCircle color={request.avatarColor} name={request.name} size={42} />
                <View style={styles.requestContent}>
                  <Text style={styles.requestName}>{request.name}</Text>
                  <Text style={styles.requestMutual}>{request.mutual} mutual connections</Text>
                </View>
                <View style={styles.requestActions}>
                  <Pressable
                    onPress={() => hapticLight()}
                    style={({ pressed }) => [styles.acceptButton, pressed && styles.buttonPressed]}
                  >
                    <Text style={styles.acceptText}>Accept</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => hapticWarning()}
                    style={({ pressed }) => [styles.declineButton, pressed && styles.buttonPressed]}
                  >
                    <Text style={styles.declineText}>Decline</Text>
                  </Pressable>
                </View>
              </View>
            </Reveal>
          ))}
        </View>

        <Reveal delay={120}>
          <SectionTitle subtitle="Call or reconnect" title="All Friends" />
        </Reveal>

        {filteredFriends.length ? (
          <View style={styles.friendsList}>
            {filteredFriends.map((friend, index) => (
              <Reveal delay={130 + index * 30} key={friend.id}>
                <FriendCard friend={friend} onCallPress={openFriendCall} />
              </Reveal>
            ))}
          </View>
        ) : (
          <Reveal delay={140}>
            <View style={styles.emptyState}>
              <Ionicons color={COLORS.secondary} name="radio-outline" size={34} />
              <Text style={styles.emptyTitle}>No friends yet. Start exploring!</Text>
            </View>
          </Reveal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
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
  title: {
    marginTop: 8,
    color: COLORS.textPrimary,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -0.5,
  },
  searchWrap: {
    minHeight: 48,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(26,26,46,0.78)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.24)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONT_FAMILY.body,
  },
  sectionHeader: {
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
  onlineRow: {
    gap: 12,
    paddingVertical: 2,
  },
  onlineItem: {
    width: 70,
    alignItems: "center",
    gap: 6,
  },
  onlineName: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.body,
    textAlign: "center",
  },
  requestList: {
    gap: 10,
  },
  requestCard: {
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26,26,46,0.74)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  requestContent: {
    flex: 1,
    minWidth: 0,
  },
  requestName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  requestMutual: {
    marginTop: 3,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.body,
  },
  requestActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  acceptButton: {
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  acceptText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  declineButton: {
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(160,160,176,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(160,160,176,0.25)",
  },
  declineText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  friendsList: {
    gap: 10,
  },
  emptyState: {
    marginTop: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.22)",
    backgroundColor: "rgba(26,26,46,0.68)",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    paddingHorizontal: 16,
    gap: 10,
  },
  emptyTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.body,
    textAlign: "center",
  },
});
