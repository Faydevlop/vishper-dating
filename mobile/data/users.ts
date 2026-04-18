import type { UserProfile } from "@/src/types/models";

export const INTEREST_TAGS = [
  "Music",
  "Sports",
  "Spirituality",
  "LGBTQ+",
  "Night Owl",
  "Travel",
  "Tech",
  "Random Chat",
] as const;

export const MOOD_FILTERS = ["All", "Music", "Sports", "Night Owl", "LGBTQ+", "Spiritual", "Random"] as const;

export const DUMMY_USERS: UserProfile[] = [
  { id: "u1", name: "Alex Ray", age: 24, gender: "Man", tags: ["Music", "Night Owl"], isOnline: true, isInCall: false, totalCalls: 148, minutesTalked: 763, avatarColor: "#7B61FF" },
  { id: "u2", name: "Mia Sol", age: 22, gender: "Woman", tags: ["Travel", "Random Chat"], isOnline: true, isInCall: false, totalCalls: 98, minutesTalked: 417, avatarColor: "#FF7A9E" },
  { id: "u3", name: "Rohan V", age: 29, gender: "Man", tags: ["Sports", "Tech"], isOnline: true, isInCall: true, totalCalls: 215, minutesTalked: 1342, avatarColor: "#4FC3F7" },
  { id: "u4", name: "Kai Noor", age: 27, gender: "Non-binary", tags: ["LGBTQ+", "Music"], isOnline: true, isInCall: false, totalCalls: 176, minutesTalked: 991, avatarColor: "#9CCC65" },
  { id: "u5", name: "Sara Iqbal", age: 31, gender: "Woman", tags: ["Spirituality", "Travel"], isOnline: true, isInCall: false, totalCalls: 122, minutesTalked: 642, avatarColor: "#FFB74D" },
  { id: "u6", name: "Dev Menon", age: 34, gender: "Man", tags: ["Tech", "Random Chat"], isOnline: false, isInCall: false, totalCalls: 89, minutesTalked: 351, avatarColor: "#BA68C8" },
  { id: "u7", name: "Nina Ghost", age: 19, gender: "Woman", tags: ["Night Owl", "Music"], isOnline: true, isInCall: false, totalCalls: 64, minutesTalked: 213, avatarColor: "#4DB6AC" },
  { id: "u8", name: "Arjun K", age: 41, gender: "Man", tags: ["Sports", "Spirituality"], isOnline: true, isInCall: true, totalCalls: 278, minutesTalked: 1844, avatarColor: "#FFD54F" },
  { id: "u9", name: "Leah Stone", age: 26, gender: "Woman", tags: ["LGBTQ+", "Travel"], isOnline: true, isInCall: false, totalCalls: 152, minutesTalked: 834, avatarColor: "#F06292" },
  { id: "u10", name: "Ritvik Sen", age: 23, gender: "Man", tags: ["Random Chat", "Tech"], isOnline: true, isInCall: false, totalCalls: 105, minutesTalked: 498, avatarColor: "#81C784" },
  { id: "u11", name: "Jules Vega", age: 28, gender: "Non-binary", tags: ["Music", "LGBTQ+"], isOnline: false, isInCall: false, totalCalls: 186, minutesTalked: 1110, avatarColor: "#90CAF9" },
  { id: "u12", name: "Priya N", age: 33, gender: "Woman", tags: ["Spirituality", "Night Owl"], isOnline: true, isInCall: false, totalCalls: 139, minutesTalked: 710, avatarColor: "#CE93D8" },
  { id: "u13", name: "Zaid Khan", age: 45, gender: "Man", tags: ["Travel", "Sports"], isOnline: false, isInCall: false, totalCalls: 341, minutesTalked: 2520, avatarColor: "#FF8A65" },
  { id: "u14", name: "Tara Blue", age: 21, gender: "Woman", tags: ["Random Chat", "Music"], isOnline: true, isInCall: false, totalCalls: 72, minutesTalked: 265, avatarColor: "#80CBC4" },
  { id: "u15", name: "Noel Finch", age: 37, gender: "Prefer not to say", tags: ["Tech", "Night Owl"], isOnline: true, isInCall: true, totalCalls: 223, minutesTalked: 1456, avatarColor: "#B0BEC5" },
];
