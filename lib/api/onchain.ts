const DEFAULT_ETHPLORER_BASE = 'https://api.ethplorer.io';
const DEFAULT_ETHPLORER_KEY = 'freekey';

function getEthplorerBase() {
  return process.env.EXPO_PUBLIC_ETHPLORER_BASE?.trim() || DEFAULT_ETHPLORER_BASE;
}

function getEthplorerKey() {
  return process.env.EXPO_PUBLIC_ETHPLORER_KEY?.trim() || DEFAULT_ETHPLORER_KEY;
}

export type TokenHolding = {
  address: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  priceUsd?: number | null;
  valueUsd?: number | null;
};

export type OnchainTransaction = {
  hash: string;
  timestamp: number;
  from: string;
  to: string;
  value: number;
  valueUsd?: number | null;
  tokenSymbol?: string | null;
  success?: boolean;
};

export type OnchainProfile = {
  ethBalance: number;
  ethPriceUsd?: number | null;
  totalValueUsd?: number | null;
  tokenHoldings: TokenHolding[];
  transactionCount: number;
  recentTransactions: OnchainTransaction[];
};

type EthplorerTokenInfo = {
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: string | number | null;
  price?: {
    rate?: number;
  } | null;
};

type EthplorerToken = {
  tokenInfo?: EthplorerTokenInfo | null;
  balance?: number;
  rawBalance?: string;
};

type EthplorerInfoResponse = {
  ETH?: {
    balance?: number;
    rawBalance?: string;
    price?: {
      rate?: number;
    } | null;
  } | null;
  tokens?: EthplorerToken[];
  countTxs?: number;
};

type EthplorerTxResponse = Array<{
  hash: string;
  timestamp: number;
  success?: boolean;
  from?: string;
  to?: string;
  value?: number;
  input?: string;
  tokenInfo?: EthplorerTokenInfo;
}>;

function parseDecimals(value?: string | number | null): number {
  if (value == null) {
    return 0;
  }

  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRawBalance(raw?: string | number | null): number | undefined {
  if (raw == null) {
    return undefined;
  }

  if (typeof raw === 'number') {
    return raw;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatTokenHolding(token: EthplorerToken): TokenHolding | null {
  const info = token.tokenInfo;

  if (!info) {
    return null;
  }

  const decimals = parseDecimals(info.decimals);
  const rawBalance = parseRawBalance(token.balance ?? token.rawBalance);

  if (rawBalance == null) {
    return null;
  }

  const amount = decimals > 0 ? rawBalance / Math.pow(10, decimals) : rawBalance;
  const priceUsd = info.price?.rate ?? null;
  const valueUsd = priceUsd != null ? amount * priceUsd : null;

  return {
    address: info.address ?? 'unknown',
    symbol: info.symbol ?? 'UNKNOWN',
    name: info.name ?? info.symbol ?? 'Unknown token',
    amount,
    decimals,
    priceUsd,
    valueUsd,
  };
}

function normalizeAddress(value?: string | null): string {
  if (!value) return 'unknown';
  return value.toLowerCase();
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchOnchainProfile(
  address: string,
  signal?: AbortSignal
): Promise<OnchainProfile> {
  const normalizedAddress = address.toLowerCase();
  const ethplorerBase = getEthplorerBase();
  const ethplorerKey = getEthplorerKey();
  const infoUrl = `${ethplorerBase}/getAddressInfo/${normalizedAddress}?apiKey=${ethplorerKey}`;
  const txUrl = `${ethplorerBase}/getAddressTransactions/${normalizedAddress}?apiKey=${ethplorerKey}&limit=10`;

  const [info, transactions] = await Promise.all([
    fetchJson<EthplorerInfoResponse>(infoUrl, signal),
    fetchJson<EthplorerTxResponse>(txUrl, signal).catch(() => [] as EthplorerTxResponse),
  ]);

  const ethBalance = info?.ETH?.balance ?? 0;
  const ethPriceUsd = info?.ETH?.price?.rate ?? null;

  const tokenHoldings = (info?.tokens ?? [])
    .map(formatTokenHolding)
    .filter((tokenHolding): tokenHolding is TokenHolding => Boolean(tokenHolding))
    .sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0))
    .slice(0, 6);

  const totalValueUsd =
    ethPriceUsd != null
      ? tokenHoldings.reduce((acc, token) => acc + (token.valueUsd ?? 0), ethBalance * ethPriceUsd)
      : undefined;

  const recentTransactions: OnchainTransaction[] = (transactions ?? []).slice(0, 5).map((tx) => {
    const value = tx.value ?? 0;
    const tokenSymbol = tx.tokenInfo?.symbol ?? (value > 0 ? 'ETH' : null);
    const txValueUsd = tokenSymbol === 'ETH' && ethPriceUsd != null ? value * ethPriceUsd : null;

    return {
      hash: tx.hash,
      timestamp: tx.timestamp,
      from: normalizeAddress(tx.from),
      to: normalizeAddress(tx.to),
      value,
      tokenSymbol,
      valueUsd: txValueUsd,
      success: tx.success,
    };
  });

  return {
    ethBalance,
    ethPriceUsd,
    totalValueUsd,
    tokenHoldings,
    transactionCount: info?.countTxs ?? recentTransactions.length,
    recentTransactions,
  };
}
