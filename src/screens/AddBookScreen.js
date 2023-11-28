// AddBookScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const AddBookScreen = ({ navigation, route }) => {
  const [book, setBook] = useState({ title: '', author: '', pages: '', genre: 'Unknown' });
  const { handleSaveBook } = route.params || {};

  const handleSaveBookLocal = () => {
    if (!book.title || !book.author || !book.pages || isNaN(book.pages) || parseInt(book.pages) <= 0) {
      // Validation failed
      return;
    }

    // Save the book locally
    handleSaveBook(book);

    // Save the book to AsyncStorage
    const saveBookToAsyncStorage = async () => {
      try {
        const savedBooks = await AsyncStorage.getItem('books');
        const books = savedBooks ? JSON.parse(savedBooks) : [];
        books.unshift(book); // Add the new book to the beginning of the array
        await AsyncStorage.setItem('books', JSON.stringify(books));
      } catch (error) {
        console.error('Error saving book to AsyncStorage:', error);
      }
    };

    saveBookToAsyncStorage();

    // Navigate back to HomeScreen using navigation.navigate
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['orange', 'white']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={book.title}
          onChangeText={(text) => setBook({ ...book, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Author"
          value={book.author}
          onChangeText={(text) => setBook({ ...book, author: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Pages"
          keyboardType="numeric"
          value={book.pages}
          onChangeText={(text) => setBook({ ...book, pages: text })}
        />
        <Picker
          style={styles.input}
          selectedValue={book.genre}
          onValueChange={(itemValue) => setBook({ ...book, genre: itemValue })}
        >
          <Picker.Item label="Unknown" value="Unknown" />
          <Picker.Item label="Romance" value="Romance" />
          <Picker.Item label="Comedy" value="Comedy" />
          <Picker.Item label="Action" value="Action" />
          <Picker.Item label="Adventure" value="Adventure" />
          <Picker.Item label="Fantasy" value="Fantasy" />
          <Picker.Item label="Horror" value="Horror" />
          <Picker.Item label="Documentary" value="Documentary" />
        </Picker>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBookLocal}>
          <Text style={styles.buttonText}>Save Book</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default AddBookScreen;
