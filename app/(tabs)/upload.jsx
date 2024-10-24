import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UploadScreen() {
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // Initialize router

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.85,
      base64: true, // Enable base64
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setImage(
        `data:${result?.assets[0].mimeType || "image/jpeg"};base64,${
          result.assets[0]?.base64
        }`
      );
    }
  };

  const handleUpload = async () => {
    if (!image) {
      ToastAndroid.show(
        "Please select an image to upload.",
        ToastAndroid.SHORT
      );
      return;
    }

    setLoading(true); // Start loading
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch("http://192.168.1.5:5000/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.replace({
          pathname: "/result",
          params: { predictedClass: data.material },
        });
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          `Error: ${errorData.error || "Unknown error"}`,
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error("Error:", error);
      ToastAndroid.show(
        "An error occurred while uploading the file",
        ToastAndroid.SHORT
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  const isDisabled = !image || loading; // Disable condition

  return (
    <View style={styles.container}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#495057",
          padding: 15,
          borderStyle: "dotted",
          paddingVertical: 25,
          borderRadius: 10,
        }}
      >
        <Text style={styles.title}>Upload Waste Image</Text>
        <Text style={styles.label}>Waste Image</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {previewImage ? (
            <Image
              source={{ uri: previewImage }}
              style={styles.selectedImage}
            />
          ) : (
            <>
              <AntDesign name="picture" size={50} color="gray" />
              <Text style={styles.imagePlaceholderText}>
                Drag and drop or click to select an image
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]} // Conditional style
          onPress={handleUpload}
          disabled={isDisabled} // Disable the button
        >
          {loading ? (
            <>
              <ActivityIndicator color="white" />
              <Text style={styles.buttonText}>Uploading...</Text>
            </>
          ) : (
            <>
              <AntDesign name="upload" size={20} color="white" />
              <Text style={styles.buttonText}>Upload and Analyze</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 27,
    fontFamily: "outfit-bold",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 22,
    color: Colors.dark.text,
    marginBottom: 10,
    fontFamily: "outfit",
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#495057",
    padding: 20,
    height: 200,
    marginBottom: 30,
  },
  imagePlaceholderText: {
    fontFamily: "outfit",
    fontSize: 15,
    color: Colors.dark.text_tint,
    marginTop: 10,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignSelf: "center",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6, // Lighten the button by reducing opacity
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontFamily: "outfit-medium",
    marginLeft: 10,
  },
});
