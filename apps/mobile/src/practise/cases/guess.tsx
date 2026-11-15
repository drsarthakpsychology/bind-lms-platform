import { Search } from "lucide-react-native";
import * as React from "react";
import { TextInput, View } from "react-native";

import { Row, RowList, Sheet, T } from "@/ds";
import { layout, space, type as scale, useTheme } from "@/theme";
import { findDiagnoses } from "../data";

/** A sheet to name a diagnosis: type a few letters, tap the one you mean. */
export function GuessSheet({ open, onClose, onGuess, tried }: { open: boolean; onClose: () => void; onGuess: (id: string) => void; tried: string[] }) {
  const c = useTheme();
  const [q, setQ] = React.useState("");
  const hits = findDiagnoses(q, 10).filter((d) => !tried.includes(d.id));
  return (
    <Sheet open={open} onClose={onClose} title="Name the diagnosis" testID="guess-sheet">
      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.primary, borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.bg, paddingHorizontal: space[4] }}>
          <Search size={18} color={c.muted} />
          <TextInput testID="guess-input" value={q} onChangeText={setQ} autoFocus placeholder="Type a few letters" placeholderTextColor={c.muted} accessibilityLabel="Diagnosis" autoCorrect={false} autoCapitalize="none" maxFontSizeMultiplier={1.4} style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]} />
        </View>
        {q.trim() ? (
          hits.length ? (
            <RowList>
              {hits.map((d) => (
                <Row
                  key={d.id}
                  title={d.name}
                  testID={`guess-${d.id}`}
                  chevron={false}
                  onPress={() => {
                    setQ("");
                    onGuess(d.id);
                  }}
                />
              ))}
            </RowList>
          ) : (
            <T tone="muted">No diagnosis by that name. Try another word.</T>
          )
        ) : (
          <T v="small" tone="muted">
            Names follow DSM-5-TR.
          </T>
        )}
      </View>
    </Sheet>
  );
}
