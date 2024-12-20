import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../lib/auth";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignUp = () => {
    if (name && email && password) {
      signup(name, email, password);
    } else {
      ToastAndroid.show("Please fill all the fields!", ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../../assets/images/leaf.png")}
        style={{ width: 60, height: 60, marginHorizontal: "auto" }}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={Colors.dark.text_tint}
          onChangeText={setName}
          value={name}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Colors.dark.text_tint}
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={Colors.dark.text_tint}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Already have an account?{" "}
          <Text
            onPress={() => router.replace("/sign-in")}
            style={styles.signupLink}
          >
            Log in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.dark.background,
    display: "flex",
    // justifyContent: "center",
    paddingTop: "20%",
    alignItems: "center",
    gap: 20,
  },
  formContainer: {
    width: "90%",
    backgroundColor: Colors.dark.background_tint,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "outfit-bold",
  },
  label: {
    fontSize: 17,
    color: Colors.dark.text,
    marginBottom: 5,
    fontFamily: "outfit",
  },
  input: {
    backgroundColor: Colors.dark.background_tint,
    color: Colors.dark.text,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.dark.icon,
    marginBottom: 15,
    fontFamily: "outfit",
    fontSize: 17,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 20,
    fontFamily: "outfit-bold",
  },
  signupText: {
    textAlign: "center",
    color: Colors.dark.text_tint,
    marginTop: 15,
    fontFamily: "outfit",
    fontSize: 18,
  },
  signupLink: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
});
