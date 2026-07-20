type UserStatus = "online" | "offline";

interface User {
  username: string;
  status: UserStatus;
  lastActivity: number;
}

type PresenceCategory = "online" | "offline" | "away";

type PresenceResult = Partial<Record<PresenceCategory, string[]>>;

const AWAY_THRESHOLD_MINUTES = 10;

function categorize(user: User): PresenceCategory {
  if (user.status === "offline") {
    return "offline";
  }

  return user.lastActivity > AWAY_THRESHOLD_MINUTES ? "away" : "online";
}

function whosOnline(users: readonly User[]): PresenceResult {
  return users.reduce<PresenceResult>((result, user) => {
    const category = categorize(user);
    const bucket = result[category] ?? [];
    bucket.push(user.username);
    result[category] = bucket;
    return result;
  }, {});
}

const users: User[] = [
  {
    username: "David",
    status: "online",
    lastActivity: 10,
  },
  {
    username: "Lucy",
    status: "offline",
    lastActivity: 22,
  },
  {
    username: "Bob",
    status: "online",
    lastActivity: 104,
  },
];

console.log(whosOnline(users));
