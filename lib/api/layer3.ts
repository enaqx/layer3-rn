import { Platform } from 'react-native';

export type LeaderboardUser = {
  rank: number;
  address: string;
  avatarCid?: string | null;
  username?: string | null;
  gmStreak: number;
  xp: number;
  level: number;
};

export type LeaderboardResponse = {
  users: Array<{
    rank: number;
    address: string;
    avatarCid?: string | null;
    username?: string | null;
    gmStreak: number;
    xp: number;
    level: number;
  }>;
};

const DEFAULT_LAYER3_ENDPOINT = 'https://layer3.xyz/api/assignment/users';
const WEB_PROXY_PATH = '/api/leaderboard';

function getConfiguredLayer3Endpoint() {
  return process.env.EXPO_PUBLIC_LAYER3_API_URL?.trim() || DEFAULT_LAYER3_ENDPOINT;
}

export async function fetchLeaderboardUsers(signal?: AbortSignal): Promise<LeaderboardUser[]> {
  const endpoint = Platform.OS === 'web' ? WEB_PROXY_PATH : getConfiguredLayer3Endpoint();

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(Platform.OS === 'web' ? { 'Cache-Control': 'no-cache' } : undefined),
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Layer3 API request failed with status ${response.status}`);
  }

  const json = (await response.json()) as LeaderboardResponse;

  if (!json || !Array.isArray(json.users)) {
    throw new Error('Unexpected Layer3 response shape');
  }

  return json.users.map((user) => ({
    rank: user.rank,
    address: user.address,
    avatarCid: user.avatarCid ?? null,
    username: user.username ?? null,
    gmStreak: user.gmStreak,
    xp: user.xp,
    level: user.level,
  }));
}
