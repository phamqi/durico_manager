import {
  BlurMask,
  Canvas,
  Group,
  Path,
  Skia,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const PEN_BOX_PATH = Skia.Path.MakeFromSVGString(
  "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
);
const PEN_STROKE_PATH = Skia.Path.MakeFromSVGString(
  "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
);

const CHECK_BOX_PATH = Skia.Path.MakeFromSVGString(
  "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
);
const CHECK_TICK_PATH = Skia.Path.MakeFromSVGString("m9 11 3 3L22 4");

export default function BlurMaskActionIcon({ isAddOrDetailScreen, size = 28 }) {
  const blurVal = useSharedValue(4);

  useEffect(() => {
    blurVal.value = 4;
    blurVal.value = withTiming(0, { duration: 350 });
  }, [isAddOrDetailScreen]);

  const animatedBlur = useDerivedValue(() => blurVal.value);
  const scale = size / 24;

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group transform={[{ scale }]}>
        <Group
          style="stroke"
          strokeWidth={2}
          strokeCap="round"
          strokeJoin="round"
          color="#111111"
        >
          <BlurMask style="normal" blur={animatedBlur} />
          {!isAddOrDetailScreen ? (
            <>
              {PEN_BOX_PATH && <Path path={PEN_BOX_PATH} />}
              {PEN_STROKE_PATH && <Path path={PEN_STROKE_PATH} />}
            </>
          ) : (
            <>
              {CHECK_BOX_PATH && <Path path={CHECK_BOX_PATH} />}
              {CHECK_TICK_PATH && <Path path={CHECK_TICK_PATH} />}
            </>
          )}
        </Group>
      </Group>
    </Canvas>
  );
}
