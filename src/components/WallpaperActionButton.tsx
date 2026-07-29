import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  iconName?: SFSymbol;
}

export const WallpaperActionButton: React.FC<Props> = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  iconName,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary,
        disabled && styles.buttonDisabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <View style={styles.contentRow}>
          {iconName && (
            <SymbolView name={iconName} size={20} tintColor="#FFFFFF" />
          )}
          <Text style={[styles.text, iconName ? { marginLeft: 8 } : null]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#27272a',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
