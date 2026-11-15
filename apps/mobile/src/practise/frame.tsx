import { router } from "expo-router";
import { CircleHelp, X } from "lucide-react-native";
import * as React from "react";
import { BackHandler, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Sheet, T } from "@/ds";
import { fonts, layout, space, useTheme } from "@/theme";

/**
 * One frame for every game and practice tool: a close button, the title,
 * How to play (a sheet), a score in the pixel font, the play area, and the
 * thumb bar pinned low for the one action.
 */
export function GameFrame({ title, howTo, score, children, thumb, testID, confirmLeave }: { title: string; howTo?: string; score?: string; children: React.ReactNode; thumb?: React.ReactNode; testID?: string; /** Ask before leaving (a round in progress). */ confirmLeave?: boolean }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [help, setHelp] = React.useState(false);
  const [leave, setLeave] = React.useState(false);
  const close = React.useCallback(() => {
    if (confirmLeave) setLeave(true);
    else if (router.canGoBack()) router.back();
    else router.replace("/practise");
  }, [confirmLeave]);
  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, [close]);
  const closeHelp = React.useCallback(() => setHelp(false), []);
  const closeLeave = React.useCallback(() => setLeave(false), []);
  return (
    <View testID={testID} style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: space[1], gap: space[1] }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} testID="game-close">
          <X size={24} color={c.ink} />
        </Pressable>
        <T v="h3" numberOfLines={1} style={{ flex: 1 }}>
          {title}
        </T>
        {score ? (
          <T style={{ fontFamily: fonts.pixelDigits, fontSize: 20, lineHeight: 28, paddingHorizontal: space[2] }} num maxFontSizeMultiplier={1.2} accessibilityLabel={`Score ${score}`} testID="game-score">
            {score}
          </T>
        ) : null}
        {howTo ? (
          <Pressable accessibilityRole="button" accessibilityLabel="How to play" onPress={() => setHelp(true)} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
            <CircleHelp size={22} color={c.ink} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView contentContainerStyle={{ padding: layout.gutter, gap: space[5], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>{children}</ScrollView>
      {thumb ? <View style={{ borderTopWidth: 1, borderColor: c.hairline, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3], gap: space[2] }}>{thumb}</View> : null}
      <Sheet open={help} onClose={closeHelp} title="How to play">
        <T tone="muted">{howTo}</T>
      </Sheet>
      <Sheet open={leave} onClose={closeLeave} title="Leave this round?">
        <View style={{ gap: space[3] }}>
          <T tone="muted">This round is not saved.</T>
          <Button
            kind="quiet"
            label="Leave"
            onPress={() => {
              setLeave(false);
              if (router.canGoBack()) router.back();
              else router.replace("/practise");
            }}
            testID="game-leave"
          />
        </View>
      </Sheet>
    </View>
  );
}

