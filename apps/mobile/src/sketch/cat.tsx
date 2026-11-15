import * as React from "react";
import { View } from "react-native";
import Svg from "react-native-svg";

import { C, Cv, E, L, P } from "./ink";

/**
 * The cat on empty screens: a few hand-drawn strokes, sitting and looking at
 * you. `mood` changes the eyes: calm (nothing here yet), sleepy (all done),
 * puzzled (something went wrong).
 */
export function SketchCat({ size = 132, mood = "calm" }: { size?: number; mood?: "calm" | "sleepy" | "puzzled" }) {
  return (
    <View style={{ width: size, height: size }} accessible={false} importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} viewBox="0 0 160 160">
        {/* tail */}
        <Cv k="cat-tail" pts={[[112, 132], [140, 128], [146, 104], [134, 92]]} sw={2.2} rough={0.7} />
        {/* body */}
        <P k="cat-body" d="M52 138 C40 104 54 82 80 82 C106 82 120 104 108 138 Z" fill={C.wash} fillStyle="solid" sw={2} />
        {/* head */}
        <E k="cat-head" cx={80} cy={62} w={66} h={54} fill={C.paper} fillStyle="solid" sw={2} />
        {/* ears */}
        <P k="cat-ear-l" d="M54 48 L52 22 L72 38" fill={C.paper} fillStyle="solid" sw={2} />
        <P k="cat-ear-r" d="M106 48 L108 22 L88 38" fill={C.paper} fillStyle="solid" sw={2} />
        {/* eyes */}
        {mood === "sleepy" ? (
          <>
            <Cv k="cat-eye-l" pts={[[62, 60], [67, 64], [72, 60]]} sw={2} single />
            <Cv k="cat-eye-r" pts={[[88, 60], [93, 64], [98, 60]]} sw={2} single />
          </>
        ) : (
          <>
            <E k="cat-eye-l" cx={67} cy={60} w={mood === "puzzled" ? 9 : 6} h={mood === "puzzled" ? 9 : 8} fill={C.ink} fillStyle="solid" sw={1} />
            <E k="cat-eye-r" cx={93} cy={60} w={6} h={8} fill={C.ink} fillStyle="solid" sw={1} />
          </>
        )}
        {/* nose and mouth */}
        <P k="cat-nose" d="M77 69 L83 69 L80 73 Z" fill={C.lime} fillStyle="solid" sw={1.4} single />
        <Cv k="cat-mouth-l" pts={[[80, 73], [76, 78], [71, 76]]} sw={1.5} single />
        <Cv k="cat-mouth-r" pts={[[80, 73], [84, 78], [89, 76]]} sw={1.5} single />
        {/* whiskers */}
        <L k="cat-w1" x1={58} y1={70} x2={40} y2={66} sw={1.1} single stroke={C.soft} />
        <L k="cat-w2" x1={58} y1={74} x2={41} y2={77} sw={1.1} single stroke={C.soft} />
        <L k="cat-w3" x1={102} y1={70} x2={120} y2={66} sw={1.1} single stroke={C.soft} />
        <L k="cat-w4" x1={102} y1={74} x2={119} y2={77} sw={1.1} single stroke={C.soft} />
        {/* paws and ground */}
        <E k="cat-paw-l" cx={68} cy={138} w={18} h={10} fill={C.paper} fillStyle="solid" sw={1.8} />
        <E k="cat-paw-r" cx={92} cy={138} w={18} h={10} fill={C.paper} fillStyle="solid" sw={1.8} />
        <L k="cat-ground" x1={26} y1={146} x2={136} y2={146} sw={1.4} stroke={C.soft} />
      </Svg>
    </View>
  );
}
