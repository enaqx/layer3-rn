import { StyleSheet, Text, View } from 'react-native';

import { Layer3Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { OnchainProfile } from '@/lib/api/onchain';

type BalanceSectionProps = {
  profile: OnchainProfile;
};

export function BalanceSection({ profile }: BalanceSectionProps) {
  const ethBalance = profile.ethBalance;
  const totalUsdValue = profile.totalValueUsd ?? 0;
  const containerBackground = useThemeColor(
    { light: Layer3Colors.neutrals.white, dark: Layer3Colors.neutrals.gray475 },
    'background'
  );
  const mutedBackground = useThemeColor(
    { light: Layer3Colors.neutrals.gray75, dark: Layer3Colors.neutrals.gray425 },
    'background'
  );
  const subtleCardBackground = useThemeColor(
    { light: Layer3Colors.neutrals.gray25, dark: Layer3Colors.neutrals.gray450 },
    'background'
  );
  const primaryText = useThemeColor({}, 'text');
  const secondaryText = useThemeColor(
    { light: Layer3Colors.neutrals.gray375, dark: Layer3Colors.neutrals.gray300 },
    'icon'
  );

  return (
    <View style={[styles.container, { backgroundColor: containerBackground }]}>
      <Text style={[styles.title, { color: primaryText }]}>Portfolio Balance</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Value</Text>
        <Text style={styles.balanceValue}>
          $
          {totalUsdValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      <View style={[styles.ethCard, { backgroundColor: mutedBackground }]}>
        <View style={styles.tokenRow}>
          <Text style={[styles.tokenSymbol, { color: primaryText }]}>ETH</Text>
          <Text style={[styles.tokenBalance, { color: primaryText }]}>
            {ethBalance.toFixed(4)} ETH
          </Text>
        </View>
      </View>

      {profile.tokenHoldings.length > 0 && (
        <View style={styles.tokensContainer}>
          <Text style={[styles.subtitle, { color: primaryText }]}>
            Tokens ({profile.tokenHoldings.length})
          </Text>
          {profile.tokenHoldings.map((token) => (
            <View
              key={token.address}
              style={[styles.tokenCard, { backgroundColor: subtleCardBackground }]}
            >
              <View style={styles.tokenRow}>
                <View style={styles.tokenInfo}>
                  <Text style={[styles.tokenSymbol, { color: primaryText }]}>{token.symbol}</Text>
                  <Text style={[styles.tokenName, { color: secondaryText }]} numberOfLines={1}>
                    {token.name}
                  </Text>
                </View>
                <View style={styles.tokenAmounts}>
                  <Text style={[styles.tokenBalance, { color: primaryText }]}>
                    {token.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </Text>
                  {token.valueUsd && (
                    <Text style={[styles.tokenUsd, { color: secondaryText }]}>
                      $
                      {token.valueUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  balanceCard: {
    backgroundColor: Layer3Colors.brandTeal,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: Layer3Colors.alpha.white90,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Layer3Colors.white,
  },
  ethCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  tokensContainer: {
    marginTop: 8,
  },
  tokenCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  tokenName: {
    fontSize: 13,
  },
  tokenAmounts: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  tokenUsd: {
    fontSize: 13,
  },
  moreText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
