import {
  cacheLeaderboardUsers,
  findUserByAddress,
  getCachedLeaderboard,
} from '../leaderboard-store';
import type { LeaderboardUser } from '@/lib/api/layer3';

const makeUser = (overrides: Partial<LeaderboardUser> = {}): LeaderboardUser => ({
  rank: 1,
  address: '0x123',
  avatarCid: null,
  username: 'user',
  gmStreak: 0,
  xp: 0,
  level: 1,
  ...overrides,
});

describe('leaderboard-store', () => {
  beforeEach(() => {
    cacheLeaderboardUsers([]);
  });

  it('caches users array and preserves reference', () => {
    const users = [
      makeUser({ address: '0xabc', rank: 2 }),
      makeUser({ address: '0xdef', rank: 3 }),
    ];

    cacheLeaderboardUsers(users);

    expect(getCachedLeaderboard()).toBe(users);
    expect(findUserByAddress('0xabc')).toBe(users[0]);
    expect(findUserByAddress('0xdef')).toBe(users[1]);
  });

  it('clears existing cache before storing new users', () => {
    const original = [makeUser({ address: '0xold', rank: 5 })];
    const updated = [makeUser({ address: '0xnew', rank: 1 })];

    cacheLeaderboardUsers(original);
    cacheLeaderboardUsers(updated);

    expect(getCachedLeaderboard()).toBe(updated);
    expect(findUserByAddress('0xold')).toBeUndefined();
    expect(findUserByAddress('0xnew')).toBe(updated[0]);
  });

  it('performs case-insensitive lookups', () => {
    const user = makeUser({ address: '0xAbCDef', username: 'mixed' });

    cacheLeaderboardUsers([user]);

    expect(findUserByAddress('0xabcdef')).toBe(user);
    expect(findUserByAddress('0XABCDEF')).toBe(user);
  });
});
