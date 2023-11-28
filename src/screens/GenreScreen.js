// GenreScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenreScreen = ({ route, navigation }) => {
  const [genreStats, setGenreStats] = useState([]);

  useEffect(() => {
    const calculateGenreStats = async () => {
      try {
        const savedBooks = await AsyncStorage.getItem('books');
        const books = savedBooks ? JSON.parse(savedBooks) : [];
        const genreCount = books.reduce((acc, book) => {
          acc[book.genre] = (acc[book.genre] || 0) + 1;
          return acc;
        }, {});

        const stats = Object.entries(genreCount).map(([genre, count]) => ({
          genre,
          count,
        }));

        setGenreStats(stats);
      } catch (error) {
        console.error('Error calculating genre stats:', error);
      }
    };

    calculateGenreStats();

    // Set navigation options with serializable function
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.headerButton} onPress={() => navigation.navigate('AddBook')}>
          Add Book
        </Text>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={genreStats}
        keyExtractor={(item) => item.genre}
        renderItem={({ item }) => (
          <View style={styles.genreItem}>
            <Text>{item.genre}</Text>
            <Text>{item.count} books</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  genreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerButton: {
    color: 'blue',
    marginRight: 10,
  },
});

export default GenreScreen;
