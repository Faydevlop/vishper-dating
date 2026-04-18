import type { CallHistoryEntry } from "@/src/types/models";

export const DUMMY_CALLS: CallHistoryEntry[] = [
  { id: "c1", callerName: "Mia Sol", callerColor: "#FF7A9E", direction: "outgoing", duration: "12:34", timestamp: "Today, 8:42 PM" },
  { id: "c2", callerName: "Rohan V", callerColor: "#4FC3F7", direction: "incoming", duration: "08:15", timestamp: "Today, 7:18 PM" },
  { id: "c3", callerName: "Nina Ghost", callerColor: "#4DB6AC", direction: "missed", duration: "00:00", timestamp: "Today, 6:02 PM" },
  { id: "c4", callerName: "Kai Noor", callerColor: "#9CCC65", direction: "incoming", duration: "21:50", timestamp: "Today, 4:47 PM" },
  { id: "c5", callerName: "Priya N", callerColor: "#CE93D8", direction: "outgoing", duration: "03:48", timestamp: "Today, 2:10 PM" },
  { id: "c6", callerName: "Leah Stone", callerColor: "#F06292", direction: "missed", duration: "00:00", timestamp: "Today, 12:32 PM" },
  { id: "c7", callerName: "Ritvik Sen", callerColor: "#81C784", direction: "outgoing", duration: "17:02", timestamp: "Yesterday, 11:06 PM" },
  { id: "c8", callerName: "Sara Iqbal", callerColor: "#FFB74D", direction: "incoming", duration: "09:27", timestamp: "Yesterday, 8:15 PM" },
  { id: "c9", callerName: "Arjun K", callerColor: "#FFD54F", direction: "incoming", duration: "14:08", timestamp: "Yesterday, 6:51 PM" },
  { id: "c10", callerName: "Tara Blue", callerColor: "#80CBC4", direction: "missed", duration: "00:00", timestamp: "Yesterday, 2:19 PM" },
  { id: "c11", callerName: "Noel Finch", callerColor: "#B0BEC5", direction: "outgoing", duration: "06:43", timestamp: "Apr 10, 10:03 PM" },
  { id: "c12", callerName: "Alex Ray", callerColor: "#7B61FF", direction: "incoming", duration: "05:11", timestamp: "Apr 10, 8:27 PM" },
];
