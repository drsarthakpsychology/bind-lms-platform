import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, useBottomSheetTimingConfigs, type BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import * as React from "react";
import { BackHandler, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { layout, motion, space, useTheme } from "@/theme";
import { T } from "./text";

/**
 * A bottom sheet for detail that would crowd the screen (today's quests, the
 * section list). Slides up in 300ms, has a grabber, closes by dragging down,
 * tapping outside, or the back gesture. Sized to its content, up to 85% of
 * the screen, then it scrolls.
 */
export function Sheet({ open, onClose, title, children, testID }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode; testID?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const ref = React.useRef<BottomSheetModal>(null);
  const timing = useBottomSheetTimingConfigs({ duration: motion.sheetIn, easing: Easing.bezier(...motion.easeOut) });

  React.useEffect(() => {
    if (open) ref.current?.present();
    else ref.current?.dismiss();
  }, [open]);

  // Back closes the sheet first; it does not leave the screen.
  React.useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [open, onClose]);

  const backdrop = React.useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={c.dark ? 0.6 : 0.45} pressBehavior="close" />, [c.dark]);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onClose}
      enableDynamicSizing
      maxDynamicContentSize={undefined}
      enablePanDownToClose
      animationConfigs={timing}
      backdropComponent={backdrop}
      backgroundStyle={{ backgroundColor: c.card, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      handleIndicatorStyle={{ backgroundColor: c.cardLine, width: 36, height: 4 }}
      accessibilityLabel={title}
    >
      <BottomSheetScrollView testID={testID} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: space[2], paddingBottom: insets.bottom + space[5], gap: space[3] }}>
        {title ? <T v="h2">{title}</T> : null}
        <View>{children}</View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
