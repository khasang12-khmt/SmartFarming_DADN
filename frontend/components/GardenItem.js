import { View, Text, TouchableOpacity, Modal, Pressable, Alert, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { set } from "react-native-reanimated";

const GardenItem = ({ navigation, garden }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  
  const handleGardenNavigation = async () => {
    axios.post(`${BASE_URL}/garden/activate`, 
      {
        gardenId: garden._id,
        pushToken: await AsyncStorage.getItem("expoPushToken"),
      }
    ).catch((err) => {
      console.log(err);
    });
    navigation.navigate("GardenDetail", garden);
  };
  const handleStatisticNavigation = () => {
    navigation.navigate("Statistic", garden);
  }
  const deleteGarden = async (id) => {
    if (id)
      await axios.delete(`${BASE_URL}/garden/${id}`)
                  .then((res)=>{setIsDelete(true)})
  };
  if (isDelete) return null;
  return (
    <View
      className={`bg-white p-3 mb-5 rounded-xl flex flex-row justify-between ${
        modalVisible ? "opacity-20" : ""
      }`}
    >
      <View>
        <View
          className="flex-row justify-between mb-3
        "
        >
          <View>
            <Text style={{ fontSize: 18, fontFamily: "HindBold" }}>
              {garden.name}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "HindLight" }}>
              Latitude:{" "}
              {garden.boundary[0] ? garden.boundary[0].latitude : "None"}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "HindLight" }}>
              Longitude:{" "}
              {garden.boundary[0] ? garden.boundary[0].longitude : "None"}
            </Text>
          </View>
        </View>
        <View className="mb-3 flex-col gap-y-2">
          <Text>Group key: {garden.group_key}</Text>
          <Text>Description: {garden.desc}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleStatisticNavigation();
          }}
        >
          <Text style={styles.buttonText}>Statistics</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-col justify-between">
        <TouchableOpacity
          onPress={() => {
            handleGardenNavigation();
          }}
        >
          <MaterialIcons
            color="#0aada8"
            size={30}
            name="remove-red-eye"
            opacity={0.7}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddGarden", { garden: garden });
          }}
        >
          <MaterialIcons color="#ffcc00" size={30} name="edit" opacity={0.7} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <MaterialIcons
            color="#F84F31"
            size={30}
            name="restore-from-trash"
            opacity={0.7}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Settings", { garden: garden });
          }}
        >
          <MaterialIcons
            color="#6a8caf"
            size={30}
            name="settings"
            opacity={0.7}
          />
        </TouchableOpacity>
        
        <DeleteModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          garden={garden}
          deleteGarden={deleteGarden}
        />
      </View>
    </View>
  );
};

const DeleteModal = ({ modalVisible, setModalVisible, garden, deleteGarden }) => {
  const confirm = async () => {
    deleteGarden(garden._id);
    setModalVisible(!modalVisible);
  }
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Delete {garden.name}?</Text>
            <View className="flex flex-row gap-x-6 mt-4">
              <Pressable
                style={[styles.buttonModal, styles.buttonDelete]}
                onPress={() => confirm()}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Return</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonDelete: {
    backgroundColor: "#F84F31",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
export default GardenItem;
