import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router"; // Ensure you're using expo-router for navigation

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter(); // Initialize router

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access media is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.85,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setImage(result.assets[0]);
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

    const formData = new FormData();
    formData.append("file", {
      uri: image.uri, // Use the uri of the image
      type: image.type, // Use the type of the image
      name: image.fileName || "photo.jpg", // Provide a name for the file
    });

    try {
      const response = await fetch("http://10.0.2.2:5000/predict", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          // Note: Don't set 'Content-Type' header when sending FormData
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to result screen with predicted class
        router.push(`/result?predictedClass=${data.material}`);
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
    }
  };

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

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <AntDesign name="upload" size={20} color="white" />
          <Text style={styles.buttonText}>Upload and Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 5,
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
  buttonText: {
    fontSize: 18,
    color: "white",
    fontFamily: "outfit-medium",
    marginLeft: 10,
  },
});
