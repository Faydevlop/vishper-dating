import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

const canUseHaptics = Platform.OS === "ios" || Platform.OS === "android";

const safeHaptic = async (task: () => Promise<void>) => {
  if (!canUseHaptics) {
    return;
  }

  try {
    await task();
  } catch {
    // Ignore haptic failures on unsupported/limited devices.
  }
};

export const hapticSelection = () => safeHaptic(() => Haptics.selectionAsync());

export const hapticLight = () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

export const hapticMedium = () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

export const hapticSuccess = () => safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

export const hapticWarning = () => safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
