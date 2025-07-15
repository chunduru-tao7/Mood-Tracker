import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      navigation.navigate("Home", { user: name });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mood Journal</Text>
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { color: "#fff", fontSize: 24, marginBottom: 20 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
