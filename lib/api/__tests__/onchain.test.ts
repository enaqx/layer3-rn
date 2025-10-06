import { fetchOnchainProfile } from '../onchain';

describe('fetchOnchainProfile', () => {
  const fetchMock = jest.fn();
  let originalFetch: typeof global.fetch | undefined;
  const originalBase = process.env.EXPO_PUBLIC_ETHPLORER_BASE;
  const originalKey = process.env.EXPO_PUBLIC_ETHPLORER_KEY;

  const mockFetchResponse = <T>(data: T, ok = true, status = ok ? 200 : 500) => ({
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
  });

  beforeAll(() => {
    originalFetch = global.fetch;
    (global as any).fetch = fetchMock;
  });

  afterAll(() => {
    if (originalFetch) {
      (global as any).fetch = originalFetch;
    } else {
      delete (global as any).fetch;
    }
  });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    if (originalBase === undefined) {
      delete process.env.EXPO_PUBLIC_ETHPLORER_BASE;
    } else {
      process.env.EXPO_PUBLIC_ETHPLORER_BASE = originalBase;
    }

    if (originalKey === undefined) {
      delete process.env.EXPO_PUBLIC_ETHPLORER_KEY;
    } else {
      process.env.EXPO_PUBLIC_ETHPLORER_KEY = originalKey;
    }
  });

  it('parses holdings and transactions with custom base and key', async () => {
    process.env.EXPO_PUBLIC_ETHPLORER_BASE = ' https://custom.ethplorer ';
    process.env.EXPO_PUBLIC_ETHPLORER_KEY = ' secretKey ';

    const infoResponse = {
      ETH: {
        balance: 2,
        price: { rate: 1500 },
      },
      tokens: Array.from({ length: 7 }, (_, index) => ({
        tokenInfo: {
          address: `0x${index}`,
          symbol: `T${index}`,
          name: `Token ${index}`,
          decimals: 0,
          price: { rate: index + 1 },
        },
        balance: index + 1,
      })),
      countTxs: 99,
    };

    const transactionsResponse = Array.from({ length: 6 }, (_, index) => ({
      hash: `tx-${index}`,
      timestamp: 1000 + index,
      from: index === 1 ? '' : `0xAAA${index}`,
      to: index === 2 ? undefined : `0xBBB${index}`,
      value: index + 0.5,
      tokenInfo: index === 3 ? { symbol: 'DAI' } : undefined,
      success: index % 2 === 0,
    }));

    fetchMock.mockResolvedValueOnce(mockFetchResponse(infoResponse));
    fetchMock.mockResolvedValueOnce(mockFetchResponse(transactionsResponse));

    const profile = await fetchOnchainProfile('0xABCDEF1234');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://custom.ethplorer/getAddressInfo/0xabcdef1234?apiKey=secretKey'
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://custom.ethplorer/getAddressTransactions/0xabcdef1234?apiKey=secretKey&limit=10'
    );

    expect(profile.ethBalance).toBe(2);
    expect(profile.ethPriceUsd).toBe(1500);
    expect(profile.tokenHoldings).toHaveLength(6);
    expect(profile.tokenHoldings[0].symbol).toBe('T6');
    expect(profile.tokenHoldings[5].symbol).toBe('T1');
    expect(profile.tokenHoldings.every((token) => token.valueUsd != null)).toBe(true);
    expect(profile.totalValueUsd).toBeCloseTo(3139);

    expect(profile.recentTransactions).toHaveLength(5);
    expect(profile.recentTransactions[0]).toMatchObject({
      hash: 'tx-0',
      from: '0xaaa0',
      to: '0xbbb0',
      tokenSymbol: 'ETH',
      valueUsd: 750,
    });
    expect(profile.recentTransactions[1]).toMatchObject({
      from: 'unknown',
      to: '0xbbb1',
    });
    expect(profile.recentTransactions[2]).toMatchObject({
      to: 'unknown',
    });
    expect(profile.transactionCount).toBe(99);
  });

  it('gracefully handles transaction fetch failure and missing price data', async () => {
    delete process.env.EXPO_PUBLIC_ETHPLORER_BASE;
    delete process.env.EXPO_PUBLIC_ETHPLORER_KEY;

    const infoResponse = {
      ETH: {
        balance: 0.5,
      },
      tokens: [],
      countTxs: 3,
    };

    fetchMock.mockResolvedValueOnce(mockFetchResponse(infoResponse));
    fetchMock.mockResolvedValueOnce(mockFetchResponse({}, false));

    const profile = await fetchOnchainProfile('0x9876');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.ethplorer.io/getAddressInfo/0x9876?apiKey=freekey'
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.ethplorer.io/getAddressTransactions/0x9876?apiKey=freekey&limit=10'
    );

    expect(profile.ethBalance).toBe(0.5);
    expect(profile.ethPriceUsd).toBeNull();
    expect(profile.totalValueUsd).toBeUndefined();
    expect(profile.tokenHoldings).toHaveLength(0);
    expect(profile.recentTransactions).toHaveLength(0);
    expect(profile.transactionCount).toBe(3);
  });
});
