import { Blur, Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import {
    interpolate,
    useDerivedValue,
    withTiming,
} from "react-native-reanimated";

const PATH_X = Skia.Path.MakeFromSVGString("M18 6 6 18 M6 6l12 12");
const PATH_K = Skia.Path.MakeFromSVGString(
  "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 16V8 m11 12 4 4 m15 8-6 6",
);

const MorphKeyIcon = ({ isMultiply }) => {
  const progress = useDerivedValue(() => {
    return withTiming(isMultiply ? 1 : 0, { duration: 220 });
  }, [isMultiply]);

  const blurRadius = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [0, 6, 0]);
  });

  const xOpacity = useDerivedValue(() =>
    interpolate(progress.value, [0.2, 0.8], [0, 1], "clamp"),
  );
  const xTransform = useDerivedValue(() => [
    { scale: interpolate(progress.value, [0, 1], [0.65, 1]) },
  ]);

  const kOpacity = useDerivedValue(() =>
    interpolate(progress.value, [0.2, 0.8], [1, 0], "clamp"),
  );
  const kTransform = useDerivedValue(() => [
    { scale: interpolate(progress.value, [0, 1], [1, 0.65]) },
  ]);

  return (
    <Canvas style={{ width: 24, height: 24 }}>
      <Group
        opacity={kOpacity}
        transform={kTransform}
        origin={{ x: 12, y: 12 }}
      >
        <Path
          path={PATH_K}
          style="stroke"
          strokeWidth={2}
          strokeCap="round"
          strokeJoin="round"
          color="#333333"
        >
          <Blur blur={blurRadius} />
        </Path>
      </Group>

      <Group
        opacity={xOpacity}
        transform={xTransform}
        origin={{ x: 12, y: 12 }}
      >
        <Path
          path={PATH_X}
          style="stroke"
          strokeWidth={2}
          strokeCap="round"
          strokeJoin="round"
          color="#333333"
        >
          <Blur blur={blurRadius} />
        </Path>
      </Group>
    </Canvas>
  );
};
export default MorphKeyIcon;
