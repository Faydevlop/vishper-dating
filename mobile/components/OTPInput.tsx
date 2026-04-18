import { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, type TextInput as TextInputType } from "react-native";
import { COLORS, FONT_FAMILY, RADIUS } from "@/src/theme/tokens";

type OTPInputProps = {
  length?: number;
  onChangeCode?: (code: string) => void;
  onComplete?: (code: string) => void;
};

export function OTPInput({ length = 6, onChangeCode, onComplete }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array.from({ length }, () => ""));
  const refs = useRef<Array<TextInputType | null>>([]);

  const code = useMemo(() => values.join(""), [values]);

  const updateValues = (next: string[]) => {
    setValues(next);
    const merged = next.join("");
    onChangeCode?.(merged);
    if (merged.length === length && !next.includes("")) {
      onComplete?.(merged);
    }
  };

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (!cleaned) {
      const next = [...values];
      next[index] = "";
      updateValues(next);
      return;
    }

    const next = [...values];
    const digit = cleaned.slice(-1);
    next[index] = digit;
    updateValues(next);

    if (index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {values.map((value, index) => (
        <Pressable key={index} onPress={() => refs.current[index]?.focus()} style={styles.pressable}>
          <TextInput
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            ref={(node) => {
              refs.current[index] = node;
            }}
            returnKeyType="done"
            style={[styles.input, value ? styles.inputFilled : undefined]}
            textAlign="center"
            value={value}
          />
        </Pressable>
      ))}
      <TextInput editable={false} style={styles.hiddenInput} value={code} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  pressable: {
    flex: 1,
  },
  input: {
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.33)",
    backgroundColor: "rgba(26, 26, 46, 0.75)",
    color: COLORS.textPrimary,
    fontSize: 22,
    lineHeight: 26,
    fontFamily: FONT_FAMILY.bodyStrong,
  },
  inputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(108,63,197,0.2)",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
});
