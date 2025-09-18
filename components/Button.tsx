import React from "react";
import { StyleSheet, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { View } from "./Themed";

type ButtonProps = {
  title: string;
  onPress: () => void;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  iconName,
  style,
  textStyle,
  iconColor = "#fff",
  iconSize = 28,
}) => {
  return (
    <View style={{ alignItems: "center" }}>
    
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BFA6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: "#00BFA6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
