import type { FriendProfile } from "@/src/types/models";

export const DUMMY_FRIENDS: FriendProfile[] = [
  { id: "f1", name: "Mia Sol", isOnline: true, lastSeen: "Online now", tags: ["Travel", "Random Chat"], avatarColor: "#FF7A9E" },
  { id: "f2", name: "Rohan V", isOnline: true, lastSeen: "Online now", tags: ["Sports", "Tech"], avatarColor: "#4FC3F7" },
  { id: "f3", name: "Kai Noor", isOnline: true, lastSeen: "Online now", tags: ["LGBTQ+", "Music"], avatarColor: "#9CCC65" },
  { id: "f4", name: "Sara Iqbal", isOnline: false, lastSeen: "Last seen 18m ago", tags: ["Spirituality", "Travel"], avatarColor: "#FFB74D" },
  { id: "f5", name: "Leah Stone", isOnline: false, lastSeen: "Last seen 1h ago", tags: ["LGBTQ+", "Travel"], avatarColor: "#F06292" },
  { id: "f6", name: "Priya N", isOnline: true, lastSeen: "Online now", tags: ["Night Owl", "Spirituality"], avatarColor: "#CE93D8" },
  { id: "f7", name: "Ritvik Sen", isOnline: false, lastSeen: "Last seen 2h ago", tags: ["Tech", "Random Chat"], avatarColor: "#81C784" },
  { id: "f8", name: "Nina Ghost", isOnline: true, lastSeen: "Online now", tags: ["Night Owl", "Music"], avatarColor: "#4DB6AC" },
  { id: "f9", name: "Tara Blue", isOnline: false, lastSeen: "Last seen yesterday", tags: ["Music", "Random Chat"], avatarColor: "#80CBC4" },
  { id: "f10", name: "Noel Finch", isOnline: false, lastSeen: "Last seen 3d ago", tags: ["Tech", "Night Owl"], avatarColor: "#B0BEC5" },
];

export const DUMMY_FRIEND_REQUESTS = [
  { id: "r1", name: "Ari Moon", avatarColor: "#9575CD", mutual: 4 },
  { id: "r2", name: "Dylan Reed", avatarColor: "#26A69A", mutual: 2 },
  { id: "r3", name: "Sam Echo", avatarColor: "#FF8A65", mutual: 1 },
];
