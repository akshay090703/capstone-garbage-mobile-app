import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, useSearchParams } from "expo-router";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

const materialInfo = {
  cardboard: {
    color: "#7f4f24",
    icon: "📦",
    title: "Cardboard",
    description: "Cardboard is recyclable and biodegradable.",
    instructions: [
      "Remove any tape or labels",
      "Flatten boxes to save space",
      "Keep dry and clean",
      "Place in the designated cardboard recycling bin",
    ],
  },
  glass: {
    color: "#0077b6",
    icon: "🫙",
    title: "Glass",
    description:
      "Glass is 100% recyclable and can be recycled endlessly without loss in quality.",
    instructions: [
      "Rinse containers thoroughly",
      "Remove caps and lids",
      "Separate by color if required",
      "Place in the glass recycling bin",
    ],
  },
  paper: {
    color: "#713f12",
    icon: "📰",
    title: "Paper",
    description:
      "Paper is recyclable and can be turned into new paper products.",
    instructions: [
      "Keep paper clean and dry",
      "Remove any plastic wrapping",
      "Shred sensitive documents",
      "Place in the paper recycling bin",
    ],
  },
  trash: {
    color: "#424655",
    icon: "🗑️",
    title: "General Waste",
    description:
      "This item is not recyclable and should be disposed of in general waste.",
    instructions: [
      "Ensure the item cannot be recycled or composted",
      "Place in a sealed bag",
      "Dispose of in the general waste bin",
      "Consider ways to reduce non-recyclable waste",
    ],
  },
  plastic: {
    color: "#284b63",
    icon: "🛢️",
    title: "Plastic",
    description:
      "Many types of plastic can be recycled into new plastic products.",
    instructions: [
      "Check the recycling symbol and number",
      "Rinse containers to remove food residue",
      "Remove caps and labels if possible",
      "Place in the plastic recycling bin",
    ],
  },
  metal: {
    color: "#FF007F",
    icon: "🔧",
    title: "Metal",
    description: "Metals like aluminum and steel are highly recyclable.",
    instructions: [
      "Rinse containers to remove food residue",
      "Remove paper labels if possible",
      "Crush cans to save space (optional)",
      "Place in the metal recycling bin",
    ],
  },
};

export default function Result() {
  const { predictedClass } = useLocalSearchParams();
  const material = materialInfo[predictedClass] || materialInfo.trash;
  const [activeInstruction, setActiveInstruction] = useState(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={500}>
        <View style={[styles.header]}>
          {/* <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: 20, top: 40 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity> */}
          <Text style={styles.title}>
            {material.icon} {material.title} Detected
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View
            animation="fadeInLeft"
            duration={500}
            delay={200}
            style={[styles.card, { backgroundColor: material.color }]}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#dbeafe"
              />
              <Text style={styles.sectionTitle}> Material Information</Text>
            </View>
            <Text style={[styles.description, { width: "90", marginLeft: 15 }]}>
              {material.description}
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            duration={500}
            delay={400}
            style={[
              styles.card,
              {
                borderWidth: 1,
                borderColor: "#495057",
                backgroundColor: "#1e3a8a",
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
              ♻️ Disposal Instructions
            </Text>
            {material.instructions.map((instruction, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setActiveInstruction(
                    activeInstruction === index ? null : index
                  )
                }
                style={[
                  styles.instruction,
                  activeInstruction === index && styles.activeInstruction,
                ]}
              >
                <View style={styles.instructionContent}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#aec8ec"
                  />
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
                {activeInstruction === index && (
                  <Animatable.Text
                    animation="fadeIn"
                    style={styles.additionalInfo}
                  >
                    Oh Nice! So you are at this step in your trash disposal
                    journey!
                  </Animatable.Text>
                )}
              </TouchableOpacity>
            ))}
          </Animatable.View>

          {predictedClass === "trash" && (
            <Animatable.View
              animation="fadeInUp"
              duration={500}
              delay={600}
              style={[styles.card, styles.warningCard]}
            >
              <Text style={styles.sectionTitle}>Waste Reduction Tips</Text>
              <Text style={styles.description}>
                Consider ways to reduce non-recyclable waste in the future. Look
                for reusable alternatives or products with less packaging.
              </Text>
            </Animatable.View>
          )}
        </ScrollView>
      </Animatable.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/upload")}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.buttonText}>Upload Another</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "transparent" }]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingTop: 70,
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    color: Colors.dark.text,
  },
  content: {
    padding: 20,
    flexGrow: 1,
    paddingBottom: 195,
  },
  card: {
    backgroundColor: Colors.dark.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    color: "#dbeafe",
  },
  description: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#CBD5E1",
    marginTop: 5,
  },
  instruction: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#172554",
  },
  activeInstruction: {
    backgroundColor: "#1e40af",
  },
  instructionContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  instructionText: {
    marginLeft: 10,
    fontFamily: "outfit",
    color: "#aec8ec",
    fontSize: 16,
  },
  additionalInfo: {
    fontFamily: "outfit",
    marginTop: 5,
    color: "#aec8ec",
    fontSize: 12,
    marginLeft: 34,
  },
  warningCard: {
    backgroundColor: "#c1121f",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#1f2937",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.dark.text,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
});
