import { StyleSheet, Text, View } from 'react-native';

import { Layer3Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { OnchainProfile } from '@/lib/api/onchain';

type TransactionsSectionProps = {
  profile: OnchainProfile;
};

export function TransactionsSection({ profile }: TransactionsSectionProps) {
  const transactions = profile.recentTransactions;
  const containerBackground = useThemeColor(
    { light: Layer3Colors.neutrals.white, dark: Layer3Colors.neutrals.gray475 },
    'background'
  );
  const cardBackground = useThemeColor(
    { light: Layer3Colors.neutrals.gray25, dark: Layer3Colors.neutrals.gray450 },
    'background'
  );
  const primaryText = useThemeColor({}, 'text');
  const secondaryText = useThemeColor(
    { light: Layer3Colors.neutrals.gray375, dark: Layer3Colors.neutrals.gray300 },
    'icon'
  );

  if (transactions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: containerBackground }]}>
      <Text style={[styles.title, { color: primaryText }]}>Recent Transactions</Text>
      <Text style={[styles.subtitle, { color: secondaryText }]}>
        Showing {Math.min(5, transactions.length)} of {profile.transactionCount} transactions
      </Text>

      {transactions.map((tx) => (
        <View key={tx.hash} style={[styles.txCard, { backgroundColor: cardBackground }]}>
          <View style={styles.txHeader}>
            <Text style={[styles.txHash, { color: primaryText }]} numberOfLines={1}>
              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
            </Text>
            <Text style={[styles.txDate, { color: secondaryText }]}>
              {new Date(tx.timestamp * 1000).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.txDetails}>
            <View style={styles.txRow}>
              <Text style={[styles.txLabel, { color: secondaryText }]}>From</Text>
              <Text style={[styles.txValue, { color: primaryText }]} numberOfLines={1}>
                {tx.from}
              </Text>
            </View>
            <View style={styles.txRow}>
              <Text style={[styles.txLabel, { color: secondaryText }]}>To</Text>
              <Text style={[styles.txValue, { color: primaryText }]} numberOfLines={1}>
                {tx.to}
              </Text>
            </View>
            <View style={styles.txRow}>
              <Text style={[styles.txLabel, { color: secondaryText }]}>Value</Text>
              <Text style={[styles.txValue, { color: primaryText }]}>
                {tx.value.toFixed(6)} {tx.tokenSymbol || 'ETH'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Layer3Colors.neutrals.white,
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  txCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Layer3Colors.brandTeal,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txHash: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 8,
  },
  txDate: {
    fontSize: 12,
  },
  txDetails: {
    gap: 6,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txLabel: {
    fontSize: 13,
    width: 60,
  },
  txValue: {
    fontSize: 13,
    fontFamily: 'monospace',
    flex: 1,
    flexShrink: 1,
  },
});
