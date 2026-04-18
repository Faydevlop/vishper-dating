export type UserGender = "Man" | "Woman" | "Non-binary" | "Prefer not to say";

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: UserGender;
  tags: string[];
  isOnline: boolean;
  isInCall: boolean;
  totalCalls: number;
  minutesTalked: number;
  avatarColor: string;
};

export type CallDirection = "incoming" | "outgoing" | "missed";

export type CallHistoryEntry = {
  id: string;
  callerName: string;
  callerColor: string;
  direction: CallDirection;
  duration: string;
  timestamp: string;
};

export type FriendProfile = {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen: string;
  tags: string[];
  avatarColor: string;
};

export type RoomEntry = {
  id: string;
  name: string;
  host: string;
  listeners: number;
  tag: string;
};
