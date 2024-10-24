import { Drawer } from "expo-router/drawer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../lib/auth";
import { Pressable } from "react-native";
import { Colors } from "../../constants/Colors";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <Pressable onPress={() => navigation.toggleDrawer()}>
            <FontAwesome
              name="bars"
              size={30}
              color={Colors.dark.text_tint}
              style={{ paddingLeft: 20 }}
            />
          </Pressable>
        ),
        headerTitle: () => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Image
              source={require("../../assets/images/leaf.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 20,
                color: Colors.dark.text,
              }}
            >
              EcoSort
            </Text>
          </View>
        ),
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTitleAlign: "center",
        drawerStyle: {
          backgroundColor: Colors.dark.background_tint,
          width: 250,
        },
        gestureEnabled: true,
        headerShown: true,
      })}
      drawerContent={(props) => {
        const currentRoute =
          props.navigation.getState().routes[props.navigation.getState().index]
            .name;

        return (
          <View
            style={{ flex: 1, justifyContent: "space-between", padding: 30 }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/leaf.png")}
                style={{ width: 70, height: 70 }}
              />
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate("index")}
                style={{ marginBottom: 20 }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color:
                      currentRoute === "index"
                        ? Colors.dark.text
                        : Colors.dark.text_tint,
                    fontFamily: "outfit",
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("history")}
                style={{ marginBottom: 20 }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color:
                      currentRoute === "history"
                        ? Colors.dark.text
                        : Colors.dark.text_tint,
                    fontFamily: "outfit",
                  }}
                >
                  History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("upload")}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color:
                      currentRoute === "upload"
                        ? Colors.dark.text
                        : Colors.dark.text_tint,
                    fontFamily: "outfit",
                  }}
                >
                  Upload
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => logout()}
                style={{
                  backgroundColor: Colors.PRIMARY,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    textAlign: "center",
                    fontFamily: "outfit-bold",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="history" options={{ title: "History" }} />
      <Drawer.Screen name="upload" options={{ title: "Upload" }} />
    </Drawer>
  );
}
