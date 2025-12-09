import { Tabs } from "expo-router";
import CustomTabBar from "../../components/CustomTabBar";

export default function RootLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Tabs.Screen
        name="add"
        options={{ headerShown: false, title: "Add" }}
      />
    </Tabs>
  );
}