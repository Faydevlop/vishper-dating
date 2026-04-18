import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MoodPill } from "@/components/MoodPill";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";
import { UserCard } from "@/components/UserCard";
import { DUMMY_ROOMS } from "@/data/rooms";
import { DUMMY_USERS, MOOD_FILTERS } from "@/data/users";
import { COLORS, FONT_FAMILY, GRADIENTS, RADIUS } from "@/src/theme/tokens";
import type { UserProfile } from "@/src/types/models";
import { hapticMedium } from "@/src/utils/haptics";
import { formatTimeShort, getGreetingByHour } from "@/src/utils/time";

const FILTER_TAG_MAP: Record<string, string | null> = {
  All: null,
  Music: "Music",
  Sports: "Sports",
  "Night Owl": "Night Owl",
  "LGBTQ+": "LGBTQ+",
  Spiritual: "Spirituality",
  Random: "Random Chat",
};

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<(typeof MOOD_FILTERS)[number]>("All");
  const [loading, setLoading] = useState(true);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const livePillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(livePillAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(livePillAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [livePillAnim]);

  const users = useMemo(() => {
    const moodTag = FILTER_TAG_MAP[selectedMood];

    const filteredOnlineUsers = DUMMY_USERS.filter((user) => user.isOnline).filter((user) => {
      if (!moodTag) {
        return true;
      }

      return user.tags.includes(moodTag);
    });

    return filteredOnlineUsers.slice(0, 10);
  }, [selectedMood]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0],
  });

  const liveOpacity = livePillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const openCallScreen = (user: Pick<UserProfile, "id" | "name" | "avatarColor" | "age" | "tags">) => {
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

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal>
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>Hey Alex 👋</Text>
            <Text style={styles.subGreeting}>
              {getGreetingByHour()} • {formatTimeShort()}
            </Text>
          </View>
        </Reveal>

        <Reveal delay={35}>
          <Animated.View style={[styles.livePill, { opacity: liveOpacity }]}> 
            <Text style={styles.liveText}>🟢 1,243 people online now</Text>
          </Animated.View>
        </Reveal>

        <Reveal delay={65}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodsWrap}>
            <View style={styles.moodsRow}>
              {MOOD_FILTERS.map((mood) => (
                <MoodPill key={mood} label={mood} onPress={() => setSelectedMood(mood)} selected={selectedMood === mood} />
              ))}
            </View>
          </ScrollView>
        </Reveal>

        <Reveal delay={95}>
          <LinearGradient colors={GRADIENTS.hero} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.featuredCard}>
            <View style={styles.featuredTextWrap}>
              <Text style={styles.featuredTitle}>Start a Random Call</Text>
              <Text style={styles.featuredSubtitle}>Match with someone new instantly</Text>
            </View>

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
              style={({ pressed }) => [styles.micWrap, pressed && styles.micWrapPressed]}
            >
              <Animated.View style={[styles.micPulse, { opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} />
              <View style={styles.micButton}>
                <Ionicons color={COLORS.textPrimary} name="mic" size={30} />
              </View>
            </Pressable>
          </LinearGradient>
        </Reveal>

        <Reveal delay={125}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Online Voices</Text>
            <Text style={styles.sectionSubtitle}>Discover and connect instantly</Text>
          </View>
        </Reveal>

        {loading ? <LoadingUserGrid /> : <UserGrid onCallPress={openCallScreen} users={users} />}

        <Reveal delay={145}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Rooms</Text>
            <Text style={styles.sectionSubtitle}>Drop in and listen live</Text>
          </View>
        </Reveal>

        <ScrollView contentContainerStyle={styles.roomsRow} horizontal showsHorizontalScrollIndicator={false}>
          {DUMMY_ROOMS.map((room, index) => (
            <Reveal delay={160 + index * 45} key={room.id}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

function UserGrid({ users, onCallPress }: { users: typeof DUMMY_USERS; onCallPress: (user: UserProfile) => void }) {
  return (
    <View style={styles.userGrid}>
      {users.map((user, index) => (
        <Reveal delay={40 + index * 55} key={user.id} style={styles.userCardSlot}>
          <UserCard onCallPress={onCallPress} user={user} />
        </Reveal>
      ))}
    </View>
  );
}

function LoadingUserGrid() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={styles.userGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.userCardSlot}>
          <View style={styles.placeholderCard}>
            <Animated.View style={[styles.shimmerStrip, { transform: [{ translateX }] }]} />
          </View>
        </View>
      ))}
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
  greetingWrap: {
    marginTop: 8,
    gap: 4,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: 27,
    lineHeight: 31,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -0.6,
  },
  subGreeting: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.body,
  },
  livePill: {
    alignSelf: "flex-start",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(0,230,118,0.38)",
    backgroundColor: "rgba(0,230,118,0.12)",
  },
  liveText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  moodsWrap: {
    marginHorizontal: -2,
  },
  moodsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 2,
  },
  featuredCard: {
    marginTop: 2,
    borderRadius: RADIUS.xl,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    overflow: "hidden",
  },
  featuredTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  featuredTitle: {
    color: COLORS.textPrimary,
    fontSize: 21,
    lineHeight: 25,
    fontFamily: FONT_FAMILY.heading,
    letterSpacing: -0.5,
  },
  featuredSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.body,
  },
  micWrap: {
    width: 86,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  micWrapPressed: {
    transform: [{ scale: 0.96 }],
  },
  micPulse: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.32)",
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(13,13,13,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    marginTop: 6,
    gap: 4,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.heading,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: FONT_FAMILY.body,
  },
  userGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  userCardSlot: {
    width: "48.5%",
  },
  placeholderCard: {
    minHeight: 182,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(26,26,46,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  shimmerStrip: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  roomsRow: {
    gap: 10,
    paddingBottom: 8,
  },
});
