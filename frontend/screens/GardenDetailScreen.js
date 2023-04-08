import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import GardenNavigator from "../navigation/GardenNavigator";
import CustomButton from "../components/CustomButton";

const GardenDetailScreen = ({ route, navigation }) => {
  const garden = route.params;
  return (
    <View className="pt-10 px-3 flex-1 justify-center bg-[#eef9bf]">
      {/* Header */}
      <View className="flex-row justify-between">
        <Text style={{ fontSize: 28, fontFamily: "HindBold" }}>
          {garden.name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ViewMap", {
              boundary: garden.boundary,
              name: garden.name,
              desc: garden.desc,
            });
          }}
          className="bg-[#6a8caf] p-3 mb-7 rounded-md"
        >
          <Text
            className="text-center text-[#000]"
            style={{
              fontFamily: "MontserratSemiBold",
              fontSize: 16,
            }}
          >
            View Map
          </Text>
        </TouchableOpacity>
      </View>
      {/* Navigator */}
      <GardenNavigator garden={garden} />
    </View>
  );
};

export default GardenDetailScreen;
