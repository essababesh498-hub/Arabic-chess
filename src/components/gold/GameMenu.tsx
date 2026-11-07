import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoldButton } from '@/components/gold/GoldButton';
import { GoldPanel } from '@/components/gold/GoldPanel';
import { gold } from '@/lib/goldTheme';
import { strings } from '@/lib/strings';

type Props = {
  topInset: number;
  onNewGame: () => void;
  onResign: () => void;
  onSettings: () => void;
  onLeaderboard: () => void;
  onHelp: () => void;
  onExit: () => void;
};

/** Every game action in one menu, anchored to the top-left of the screen. */
export function GameMenu({
  topInset,
  onNewGame,
  onResign,
  onSettings,
  onLeaderboard,
  onHelp,
  onExit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 8, y: topInset + 46 });
  const anchorRef = useRef<React.ComponentRef<typeof View>>(null);

  function choose(action: () => void) {
    setOpen(false);
    action();
  }

  function openMenu() {
    const node = anchorRef.current;
    if (node?.measureInWindow) {
      node.measureInWindow((x, y, _width, height) => {
        setAnchor({ x, y: y + height + 6 });
        setOpen(true);
      });
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <View ref={anchorRef} collapsable={false} style={styles.togglePress}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="القائمة"
        accessibilityState={{ expanded: open }}
        onPress={() => (open ? setOpen(false) : openMenu())}
      >
        <GoldPanel contentStyle={styles.toggle}>
          <Ionicons name={open ? 'close' : 'menu'} size={18} color={gold.goldBright} />
          <Text style={styles.toggleLabel}>القائمة</Text>
        </GoldPanel>
      </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={styles.dismiss} onPress={() => setOpen(false)} />
          <View style={[styles.list, { top: anchor.y, left: anchor.x }]}>
            <GoldButton
              style={styles.item}
              icon="refresh"
              label={strings.newGame}
              onPress={() => choose(onNewGame)}
            />
            <GoldButton
              style={styles.item}
              icon="flag-outline"
              label={strings.resign}
              onPress={() => choose(onResign)}
            />
            <GoldButton
              style={styles.item}
              icon="settings-outline"
              label="الإعدادات"
              onPress={() => choose(onSettings)}
            />
            <GoldButton
              style={styles.item}
              icon="trophy-outline"
              label="المتصدرين"
              onPress={() => choose(onLeaderboard)}
            />
            <GoldButton
              style={styles.item}
              icon="help-circle-outline"
              label="المساعدة"
              onPress={() => choose(onHelp)}
            />
            <GoldButton
              style={styles.item}
              icon="exit-outline"
              label="خروج"
              onPress={() => choose(onExit)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  togglePress: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  toggle: {
    minHeight: 36,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  toggleLabel: {
    color: gold.text,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  dismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  list: {
    position: 'absolute',
    width: 220,
    gap: 6,
    zIndex: 2,
  },
  item: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: '100%',
  },
});
