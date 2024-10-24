import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>Welcome to EcoSort</Text>
        <Text style={styles.subtitle}>
          Upload images of waste items and get smart sorting and recycling
          recommendations. Help make our planet cleaner, one item at a time.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/upload")}
        >
          <Text style={styles.buttonText}>Start Sorting</Text>
          <AntDesign name="arrowright" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <AntDesign name="sync" size={40} color="green" />
            <Text style={styles.cardTitle}>Recycle</Text>
            <Text style={styles.cardDescription}>
              Learn how to properly recycle various materials.
            </Text>
          </View>

          <View style={styles.card}>
            <AntDesign name="delete" size={40} color="green" />
            <Text style={styles.cardTitle}>Reduce Waste</Text>
            <Text style={styles.cardDescription}>
              Tips on reducing your overall waste production.
            </Text>
          </View>

          <View style={styles.card}>
            <AntDesign name="enviromento" size={40} color="green" />
            <Text style={styles.cardTitle}>Go Green</Text>
            <Text style={styles.cardDescription}>
              Discover more ways to live an eco-friendly lifestyle.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 36,
    fontStyle: "outfit-bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 30,
  },
  subtitle: {
    fontStyle: "outfit",
    fontSize: 17,
    color: Colors.dark.text,
    width: "85%",
    marginHorizontal: "auto",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.dark.text,
    marginRight: 10,
    fontFamily: "outfit-bold",
  },
  cardsContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.dark.background_tint,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "85%",
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.dark.text,
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: Colors.dark.text_tint,
    textAlign: "center",
    fontFamily: "outfit",
    marginTop: 10,
  },
});
