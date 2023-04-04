import { View, Text } from "react-native";
import React from "react";
import { gardenHistory } from "../data";
import GardenHistory from "../components/GardenHistory";
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GardenHistoryPage = () => {
  const navigation = useNavigation();

  return (
    <View className="pt-3 flex-1 bg-[#eef9bf]">
      {/* Button to navigate Statistics */}

      {/* List of Gardens */}
      {gardenHistory.map((item, index) => (
        <GardenHistory
          key={index}
          name={item.name}
          status={item.status}
          timestamp={item.timestamp}
          humid={item.humid}
          temp={item.temp}
          light={item.light}
        />
      ))}
    </View>
  );
};



export default GardenHistoryPage;
