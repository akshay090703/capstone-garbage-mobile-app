import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
  Modal,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const HistoryPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const router = useRouter();

  const fetchResults = async (isRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await fetch("http://192.168.1.5:5000/history", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          ToastAndroid.show("Failed to fetch history", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("No token found", ToastAndroid.SHORT);
        router.replace("/sign-in");
      }
    } catch (error) {
      ToastAndroid.show("Error fetching history", ToastAndroid.SHORT);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchResults(); // Initial fetch on page load
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResults(true);
  };

  const handleViewDetails = (predictedClass) => {
    router.replace({
      pathname: "/result",
      params: { predictedClass },
    });
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token && selectedRecordId) {
        const response = await fetch(
          `http://192.168.1.5:5000/delete/${selectedRecordId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          fetchResults();
          ToastAndroid.show("Record deleted successfully", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Failed to delete record", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      ToastAndroid.show("Error deleting record", ToastAndroid.SHORT);
    } finally {
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: `${item.image_base64}` }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleViewDetails(item.prediction)}>
            <Text style={styles.link}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedRecordId(item.id);
              setModalVisible(true); // Show modal
            }}
          >
            <MaterialIcons name="delete" size={28} color="#c1121f" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No 🗑️ available.</Text>
      <Text style={styles.instructionText}>
        You haven't uploaded any waste images yet.
      </Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => router.push("/upload")}
      >
        <Text style={styles.uploadButtonText}>Upload Your Photo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload History</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={
            results.length === 0 ? styles.emptyContentContainer : null
          }
        />
      )}

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalMessage}>
              This action cannot be undone. This will permanently delete this
              record from your history.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.dark.background,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#495057",
  },
  imageContainer: {
    height: 160,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  date: {
    color: Colors.dark.text_tint,
    fontFamily: "outfit",
    fontSize: 15,
    marginBottom: 8,
  },
  link: {
    color: Colors.PRIMARY,
    fontSize: 17,
    fontFamily: "outfit",
    marginBottom: 8,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background_tint,
  },
  modalContent: {
    backgroundColor: Colors.dark.background_tint,
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#495057",
  },
  modalTitle: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "outfit-medium",
  },
  modalMessage: {
    fontSize: 16,
    color: "#adb5bd",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "outfit",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cancelButton: {
    flex: 1, // This makes the button take the available space
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#495057",
    marginRight: 10,
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontFamily: "outfit",
    textAlign: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    color: Colors.dark.text,
    textAlign: "center",
    fontFamily: "outfit",
    marginBottom: 5,
  },
  instructionText: {
    color: Colors.dark.text_tint,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "outfit",
  },
  uploadButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HistoryPage;
