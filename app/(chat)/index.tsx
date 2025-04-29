import { Text, View, StatusBar } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar backgroundColor="black"/>
      <Text style={{color: 'white'}}>Chat</Text>
    </View>
  );
}
