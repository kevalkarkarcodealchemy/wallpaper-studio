import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, StatusBar, AppState, Linking, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

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
  const [notifications, setNotifications] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotifications(status === 'granted');
  };

  useEffect(() => {
    checkNotificationPermission();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkNotificationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNotificationToggle = async (newValue: boolean) => {
    if (newValue) {
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        setNotifications(true);
      } else if (canAskAgain) {
        const { status: requestedStatus } = await Notifications.requestPermissionsAsync();
        setNotifications(requestedStatus === 'granted');
      } else {
        Linking.openSettings();
      }
    } else {
      Linking.openSettings();
    }
  };


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
              onToggle={handleNotificationToggle}
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
              onPress={() => setShowRateModal(true)}
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
              onPress={() => setShowAboutModal(true)}
              isLast
            />
          </View>
        </View>


        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showRateModal}
        onRequestClose={() => setShowRateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setShowRateModal(false)}
              hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            >
              <Ionicons name="close-circle-outline" size={26} color="#64748b" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Enjoy Our App</Text>

            <View style={styles.starsContainer}>
              <Ionicons name="star" size={24} color="#f59e0b" style={{ marginTop: 20 }} />
              <Ionicons name="star" size={36} color="#f59e0b" style={{ marginTop: 10 }} />
              <Ionicons name="star" size={56} color="#f59e0b" style={{ zIndex: 10 }} />
              <Ionicons name="star" size={36} color="#f59e0b" style={{ marginTop: 10 }} />
              <Ionicons name="star" size={24} color="#f59e0b" style={{ marginTop: 20 }} />
            </View>
            
            <Text style={styles.modalText}>
              If you enjoy using our app,{'\n'}Please rate us
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButtonRate} 
              onPress={() => {
                setShowRateModal(false);
              }}
            >
              <Text style={styles.modalButtonTextRate}>Rate Now</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAboutModal}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'flex-start', paddingBottom: 24, paddingTop: 24 }]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 24, position: 'relative'}}>
              <Text style={[styles.modalTitle, {marginBottom: 0, paddingHorizontal: 32}]}>About Wallpaper Studio</Text>
              <TouchableOpacity 
                onPress={() => setShowAboutModal(false)}
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                style={{position: 'absolute', right: 0}}
              >
                <Ionicons name="close-circle-outline" size={26} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{maxHeight: 400, width: '100%'}} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={styles.aboutAppHeader}>
                 <View style={styles.aboutAppIconContainer}>
                    <Ionicons name="color-palette" size={32} color="#ffffff" />
                 </View>
                 <Text style={styles.aboutAppName}>Wallpaper Studio</Text>
                 <Text style={styles.aboutAppVersion}>Version 1.0.0</Text>
              </View>

              <View style={styles.aboutSection}>
                <View style={styles.aboutSectionHeader}>
                  <Ionicons name="information-circle" size={20} color="#3b82f6" />
                  <Text style={styles.aboutHeading}>Description</Text>
                </View>
                <Text style={styles.aboutText}>
                  Wallpaper Studio brings you a curated collection of high-quality wallpapers for your device. Explore diverse categories, find stunning 4K images, and personalize your screen with ease.
                </Text>
              </View>

              <View style={styles.aboutSection}>
                <View style={styles.aboutSectionHeader}>
                  <Ionicons name="document-text" size={20} color="#3b82f6" />
                  <Text style={styles.aboutHeading}>Terms and Conditions</Text>
                </View>
                <Text style={styles.aboutText}>
                  By using Wallpaper Studio, you agree to our terms of service. The wallpapers provided are for personal use only. Redistribution or commercial use of the images without proper licensing is prohibited.
                </Text>
              </View>
              
              <View style={styles.aboutSection}>
                <View style={styles.aboutSectionHeader}>
                  <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
                  <Text style={styles.aboutHeading}>Privacy</Text>
                </View>
                <Text style={styles.aboutText}>
                  We value your privacy. Wallpaper Studio does not collect any personally identifiable information without your consent. Your preferences and saved wallpapers are stored locally on your device.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    color: '#1e293b',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  modalText: {
    color: '#475569',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  modalButtonRate: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    height: 46,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonTextRate: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  aboutAppHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aboutAppIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutAppName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  aboutAppVersion: {
    fontSize: 14,
    color: '#64748b',
  },
  aboutSection: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  aboutSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aboutHeading: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },
  aboutText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
});
