import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/src/theme/tokens";
import { hapticSelection } from "@/src/utils/haptics";

type RouteKey = "explore" | "calls" | "friends" | "profile";

const iconMap: Record<RouteKey, { inactive: keyof typeof Ionicons.glyphMap; active: keyof typeof Ionicons.glyphMap }> = {
  explore: { inactive: "compass-outline", active: "compass" },
  calls: { inactive: "call-outline", active: "call" },
  friends: { inactive: "people-outline", active: "people" },
  profile: { inactive: "person-outline", active: "person" },
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const iconScales = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    const activeRoute = state.routes[state.index];
    if (!activeRoute) {
      return;
    }

    if (!iconScales.current[activeRoute.key]) {
      iconScales.current[activeRoute.key] = new Animated.Value(1);
    }

    Animated.sequence([
      Animated.spring(iconScales.current[activeRoute.key], {
        toValue: 1.15,
        speed: 28,
        bounciness: 5,
        useNativeDriver: true,
      }),
      Animated.spring(iconScales.current[activeRoute.key], {
        toValue: 1,
        speed: 30,
        bounciness: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [state.index, state.routes]);

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name as RouteKey;
          const descriptor = descriptors[route.key];
          const options = descriptor.options;

          if (!iconScales.current[route.key]) {
            iconScales.current[route.key] = new Animated.Value(1);
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              hapticSelection();
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const icons = iconMap[routeName] ?? iconMap.explore;
          const iconName = isFocused ? icons.active : icons.inactive;
          const badge = routeName === "calls" ? "3" : options.tabBarBadge;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              key={route.key}
              onLongPress={onLongPress}
              onPress={onPress}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <View>
                <Animated.View style={{ transform: [{ scale: iconScales.current[route.key] }] }}>
                  <Ionicons color={isFocused ? COLORS.primary : COLORS.textSecondary} name={iconName} size={24} />
                </Animated.View>
                {typeof badge === "string" || typeof badge === "number" ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ) : null}
              </View>
              {isFocused ? <View style={styles.activeDot} /> : <View style={styles.dotPlaceholder} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.18)",
    paddingTop: 10,
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    gap: 5,
  },
  itemPressed: {
    opacity: 0.85,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: COLORS.callActive,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
  },
});
