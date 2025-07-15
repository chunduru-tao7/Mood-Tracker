import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

const moods = ["😄", "😊", "😐", "😢", "😡", "😴", "🤯", "😇", "🥳", "🤢", "😰", "🤠","🤗","🥺","😎"];

export default function Home({ route }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState([]);
  const username = route.params?.user || "User";

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const saved = await AsyncStorage.getItem("moodEntries");
    if (saved) setEntries(JSON.parse(saved));
  };

  const saveEntry = async () => {
    if (!selectedMood || !journal) {
      Alert.alert("Error", "Please select a mood and write your journal.");
      return;
    }

    const newEntry = {
      mood: selectedMood,
      journal,
      date: new Date().toLocaleDateString(),
      id: Date.now().toString(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    await AsyncStorage.setItem("moodEntries", JSON.stringify(updated));
    setSelectedMood(null);
    setJournal("");
  };

  const deleteEntry = async (id) => {
    const filtered = entries.filter((item) => item.id !== id);
    setEntries(filtered);
    await AsyncStorage.setItem("moodEntries", JSON.stringify(filtered));
  };

  const renderEntry = ({ item }) => (
    <View style={styles.entry}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.entryMood}>{item.mood}</Text>
        <TouchableOpacity onPress={() => deleteEntry(item.id)}>
          <Text style={{ color: "#f44336", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.entryText}>{item.journal}</Text>
      <Text style={styles.entryDate}>{item.date}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Hello, {username} 👋</Text>
        <Text style={styles.subtitle}>How do you feel today?</Text>

        <View style={styles.moodRow}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              onPress={() => setSelectedMood(mood)}
              style={[
                styles.moodButton,
                selectedMood === mood && styles.selectedMood,
              ]}
            >
              <Text style={styles.moodText}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Write your thoughts..."
          placeholderTextColor="#aaa"
          multiline
          value={journal}
          onChangeText={setJournal}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
          <Text style={styles.saveText}>Save Entry</Text>
        </TouchableOpacity>

        <Text style={styles.historyTitle}>Your Mood History</Text>
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20, paddingTop: 40 },
  subtitle: { fontSize: 18, color: "#fff", marginBottom: 10, textAlign: "center" },
moodRow: {
  flexDirection: "row",
  flexWrap: "wrap",      
  justifyContent: "space-between",
  marginBottom: 15,
},
moodButton: {
  padding: 10,
  borderRadius: 10,
  backgroundColor: "#222",
  marginBottom: 10,
  width: "18%",        
  alignItems: "center",
},
  selectedMood: { backgroundColor: "#4caf50" },
  moodText: { fontSize: 24, color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 15,
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  historyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  entry: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  entryMood: { fontSize: 22, color: "#fff" },
  entryText: { fontSize: 16, marginTop: 5, color: "#ccc" },
  entryDate: { fontSize: 12, color: "#888", marginTop: 5 },
});
