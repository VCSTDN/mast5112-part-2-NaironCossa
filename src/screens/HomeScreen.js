// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [totalPagesRead, setTotalPagesRead] = useState(0);
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [lastBook, setLastBook] = useState(null);

  const handleSaveBook = async (book) => {
    const totalPages = parseInt(book.pages);
    const newTotalPagesRead = totalPagesRead + totalPages;
    const newNumberOfBooks = numberOfBooks + 1;

    setTotalPagesRead(newTotalPagesRead);
    setNumberOfBooks(newNumberOfBooks);
    setLastBook(book);

    // Save the updated total pages and number of books to AsyncStorage
    try {
      await AsyncStorage.setItem('totalPagesRead', newTotalPagesRead.toString());
      await AsyncStorage.setItem('numberOfBooks', newNumberOfBooks.toString());
      await AsyncStorage.setItem('lastBook', JSON.stringify(book)); // Save the last book
    } catch (error) {
      console.error('Error saving data:', error);
    }

    Alert.alert('Success', 'Book saved successfully.');
  };

  const handleClearData = async () => {
    // Clear all AsyncStorage values
    try {
      await AsyncStorage.removeItem('totalPagesRead');
      await AsyncStorage.removeItem('numberOfBooks');
      await AsyncStorage.removeItem('lastBook');
      Alert.alert('Success', 'Data cleared successfully.');
      setTotalPagesRead(0);
      setNumberOfBooks(0);
      setLastBook(null);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const averagePages = numberOfBooks > 0 ? totalPagesRead / numberOfBooks : 0;

  useEffect(() => {
    // Load initial values from AsyncStorage when the component mounts
    const loadInitialValues = async () => {
      try {
        const savedTotalPages = await AsyncStorage.getItem('totalPagesRead');
        const savedNumberOfBooks = await AsyncStorage.getItem('numberOfBooks');
        const savedLastBook = await AsyncStorage.getItem('lastBook');

        // Set initial values or default to 0 if data is not present
        setTotalPagesRead(savedTotalPages ? parseInt(savedTotalPages) : 0);
        setNumberOfBooks(savedNumberOfBooks ? parseInt(savedNumberOfBooks) : 0);

        // Parse the savedLastBook JSON or set to null if data is not present
        setLastBook(savedLastBook ? JSON.parse(savedLastBook) : null);
      } catch (error) {
        console.error('Error loading initial values:', error);
      }
    };

    loadInitialValues();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('AddBook', { handleSaveBook })}
          >
            <Text style={styles.buttonText}>Add Book</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleClearData}>
            <Text style={styles.buttonText}>Clear Data</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <LinearGradient colors={['orange', 'white']} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View style={styles.container}>
        {lastBook ? (
          <View style={styles.bookDetails}>
            <Text>Last Book Read:</Text>
            <Text>Title: {lastBook.title}</Text>
            <Text>Author: {lastBook.author}</Text>
            <Text>Genre: {lastBook.genre}</Text>
            <Text>Pages: {lastBook.pages}</Text>
          </View>
        ) : (
          <Text>No books added yet.</Text>
        )}
        <View style={styles.stats}>
          <Text>Total Pages Read: {totalPagesRead}</Text>
          <Text>Average Pages Read: {averagePages.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>Go to History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Genre')}
        >
          <Text style={styles.buttonText}>Go to Genre</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AddBook', { handleSaveBook })}
        >
          <Text style={styles.buttonText}>Add Book</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  navButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  bookDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  stats: {
    marginTop: 20,
  },
  headerButtons: {
    flexDirection: 'row',
  },
});
