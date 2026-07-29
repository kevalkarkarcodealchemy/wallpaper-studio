import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

function SettingRow({ icon, title, subtitle, value, onToggle, onPress, isLast, destructive }: SettingRowProps) {
  return (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.7 : 1} 
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={[styles.row, !isLast && styles.rowBorder]}>
        <View style={[styles.iconWrap, destructive && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={destructive ? '#ef4444' : '#ffffff'} 
          />
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, destructive && { color: '#ef4444' }]}>{title}</Text>
          {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
        
        {onToggle !== undefined ? (
          <Switch 
            value={value} 
            onValueChange={onToggle} 
            trackColor={{ false: '#3f3f46', true: '#3b82f6' }}
            thumbColor={'#ffffff'}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#52525b" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [hqDownloads, setHqDownloads] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Ionicons name="settings" size={28} color="#ffffff" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingRow 
              icon="notifications" 
              title="Push Notifications" 
              subtitle="New wallpapers and updates"
              value={notifications}
              onToggle={setNotifications}
            />
            <SettingRow 
              icon="arrow-down-circle" 
              title="High Quality Downloads" 
              subtitle="Always download in 4K resolution"
              value={hqDownloads}
              onToggle={setHqDownloads}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.card}>
            <SettingRow 
              icon="star" 
              title="Rate the App" 
              onPress={() => {}}
            />
            <SettingRow 
              icon="mail" 
              title="Contact Us" 
              onPress={() => {}}
            />
            <SettingRow 
              icon="document-text" 
              title="Privacy Policy" 
              onPress={() => {}}
            />
            <SettingRow 
              icon="information-circle" 
              title="About Wallpaper Studio" 
              subtitle="Version 1.0.0"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <SettingRow 
              icon="trash" 
              title="Clear Image Cache" 
              subtitle="Free up 124 MB"
              onPress={() => {}}
              destructive
              isLast
            />
          </View>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#a1a1aa',
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 12,
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rowTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: '#a1a1aa',
    fontSize: 13,
    marginTop: 2,
  },
});
