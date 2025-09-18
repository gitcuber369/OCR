import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<
    typeof Ionicons | typeof FontAwesome | typeof MaterialIcons
  >["name"];
  color: string;
  useFontAwesome?: boolean;
  useMaterialIcons?: boolean;
}) {
  const IconComponent = props.useFontAwesome
    ? FontAwesome
    : props.useMaterialIcons
    ? MaterialIcons
    : Ionicons;
  //@ts-ignore
  return <IconComponent size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="Scaner"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <TabBarIcon name="scan" color={color} />,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="history" color={color} useMaterialIcons={true} />
          ),
        }}
      />
      <Tabs.Screen
        name="Details"
        options={{
          title: "Details",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="database" color={color} useFontAwesome={true} />
          ),
        }}
      />
    </Tabs>
  );
}
