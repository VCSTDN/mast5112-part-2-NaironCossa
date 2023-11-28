// HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const savedBooks = await AsyncStorage.getItem('books');
        const books = savedBooks ? JSON.parse(savedBooks) : [];
        
        // Set the last three books to the state
        setHistory(books.slice(0, 3));
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <LinearGradient colors={['orange', 'white']} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View style={styles.container}>
        <Text>History Screen</Text>
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookDetails}>
              <Text>Title: {item.title}</Text>
              <Text>Author: {item.author}</Text>
              <Text>Pages: {item.pages}</Text>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bookDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default HistoryScreen;
