import type { LeaderboardUser } from '@/lib/api/layer3';

let leaderboardUsers: LeaderboardUser[] = [];
const leaderboardMap = new Map<string, LeaderboardUser>();

export function cacheLeaderboardUsers(users: LeaderboardUser[]) {
  leaderboardUsers = users;
  leaderboardMap.clear();
  users.forEach((user) => {
    leaderboardMap.set(user.address.toLowerCase(), user);
  });
}

export function getCachedLeaderboard(): LeaderboardUser[] {
  return leaderboardUsers;
}

export function findUserByAddress(address: string): LeaderboardUser | undefined {
  return leaderboardMap.get(address.toLowerCase());
}
