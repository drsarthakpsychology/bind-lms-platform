import * as React from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { layout, space, type as scale, useTheme } from "@/theme";
import { T } from "./text";

export type FieldProps = Omit<TextInputProps, "style"> & {
  label: string;
  /** Shown in red under the field; also read out. */
  error?: string | null;
  hint?: string;
  /** A password: hidden, with a Show / Hide word on the right. */
  secret?: boolean;
  /** Several lines (a question, a message). */
  area?: boolean;
  inputRef?: React.Ref<React.ComponentRef<typeof TextInput>>;
};

/** A form field: the label above, a 52px box, the error under it. */
export function Field({ label, error, hint, secret, area, onFocus, onBlur, inputRef, ...rest }: FieldProps) {
  const c = useTheme();
  const [focus, setFocus] = React.useState(false);
  const [show, setShow] = React.useState(false);
  return (
    <View style={{ gap: space[2] }}>
      <T v="small">{label}</T>
      <View style={{ flexDirection: "row", alignItems: area ? "flex-start" : "center", minHeight: area ? 120 : layout.primary, borderRadius: layout.radius, borderWidth: focus ? 2 : 1.5, borderColor: error ? c.danger : focus ? c.link : c.cardLine, backgroundColor: c.card, paddingHorizontal: focus ? space[4] - 0.5 : space[4] }}>
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          placeholderTextColor={c.muted}
          selectionColor={c.brand}
          cursorColor={c.link}
          multiline={area}
          textAlignVertical={area ? "top" : "center"}
          secureTextEntry={secret && !show}
          maxFontSizeMultiplier={1.4}
          {...rest}
          onFocus={(e) => {
            setFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            onBlur?.(e);
          }}
          style={[scale.body, { flex: 1, color: c.ink, paddingVertical: area ? space[3] : 0, minHeight: area ? 116 : layout.target }, { outlineStyle: "none" } as object]}
        />
        {secret ? (
          <Pressable accessibilityRole="button" accessibilityLabel={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)} hitSlop={8} style={{ minHeight: layout.target, justifyContent: "center", paddingLeft: space[3] }}>
            <T v="small" tone="link">
              {show ? "Hide" : "Show"}
            </T>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : hint ? (
        <T v="small" tone="muted">
          {hint}
        </T>
      ) : null}
    </View>
  );
}
