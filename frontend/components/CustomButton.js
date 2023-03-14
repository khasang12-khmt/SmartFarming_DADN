import { Text, TouchableOpacity } from "react-native";
import React from "react";

export default function CustomButton({ label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#6a8caf] p-5 mb-7 rounded-md"
    >
      <Text
        className="text-center text-[#000]"
        style={{
          fontFamily: "MontserratRegular",
          fontSize: 24,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
