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
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";

const HistoryPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

        console.log(response);

        if (response.ok) {
          try {
            const data = await response.json();
            setResults(data);
          } catch (error) {
            ToastAndroid.show("Error parsing JSON", ToastAndroid.SHORT);
          }
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

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true); // Start the refreshing indicator
    fetchResults(true); // Fetch data again on refresh
  };

  // Handle navigation to result page
  const handleViewDetails = (predictedClass) => {
    router.push({
      pathname: "/result",
      params: { predictedClass },
    });
  };

  // Render each item in the list
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        <TouchableOpacity onPress={() => handleViewDetails(item.prediction)}>
          <Text style={styles.link}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload History</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Pull to refresh control
          }
        />
      )}
    </View>
  );
};

const styles = {
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
  content: {
    alignItems: "center",
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
    textDecorationLine: "underline",
    fontFamily: "outfit",
  },
};

export default HistoryPage;
