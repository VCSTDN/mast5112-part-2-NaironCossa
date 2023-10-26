import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

const Stack = createNativeStackNavigator();
const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Biography', 'Self-Help'];

function HomeScreen({ navigation }) {
  const [totalPagesRead, setTotalPagesRead] = useState(0);
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [lastBook, setLastBook] = useState(null);

  const handleSaveBook = (book) => {
    if (!book.title || !book.author || !book.pages || isNaN(book.pages) || parseInt(book.pages) <= 0) {
      Alert.alert('Invalid Input', 'Please fill out all fields and ensure "Number of Pages" is a positive number.');
      return;
    }

    const totalPages = parseInt(book.pages);
    const newTotalPagesRead = totalPagesRead + totalPages;
    const newNumberOfBooks = numberOfBooks + 1;

    setTotalPagesRead(newTotalPagesRead);
    setNumberOfBooks(newNumberOfBooks);
    setLastBook(book);

    Alert.alert('Success', 'Book saved successfully.');
  };

  const averagePages = numberOfBooks > 0 ? totalPagesRead / numberOfBooks : 0;

  return (
    <LinearGradient colors={['orange', 'white']} style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View style={styles.container}>
        {lastBook && (
          <View style={styles.bookDetails}>
            <Text>Last Book Read:</Text>
            <Text>Title: {lastBook.title}</Text>
            <Text>Author: {lastBook.author}</Text>
            <Text>Genre: {lastBook.genre}</Text>
            <Text>Pages: {lastBook.pages}</Text>
          </View>
        )}
        <View style={styles.stats}>
          <Text>Total Pages Read: {totalPagesRead}</Text>
          <Text>Average Pages Read: {averagePages.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History', { books: lastBook ? [lastBook] : [] })}
        >
          <Text style={styles.buttonText}>Go to History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Genre')}>
          <Text style={styles.buttonText}>Go to Genre</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AddBook', { handleSaveBook })}
        >
          <Text style={styles.buttonText}>Go to Add Book</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function HistoryScreen({ route }) {
  const { books } = route.params;
  return (
    <View style={styles.container}>
      <Text>History Screen</Text>
      <Text>Books: {JSON.stringify(books)}</Text>
    </View>
  );
}

function GenreScreen() {
  return (
    <View style={styles.container}>
      <Text>Genre Screen</Text>
    </View>
  );
}

function AddBookScreen({ route }) {
  const { handleSaveBook } = route.params;
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: genres[0],
    pages: '',
  });

  const saveBook = () => {
    handleSaveBook(book);
    setBook({
      title: '',
      author: '',
      genre: genres[0],
      pages: '',
    });
  };

  return (
    <LinearGradient colors={['orange', 'white']} style={{ flex: 1, justifyContent: 'flex-end' }}>
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
        <Picker
          selectedValue={book.genre}
          style={styles.input}
          onValueChange={(itemValue) => setBook({ ...book, genre: itemValue })}
        >
          {genres.map((genre, index) => (
            <Picker.Item key={index} label={genre} value={genre} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Number of Pages"
          keyboardType="numeric"
          value={book.pages}
          onChangeText={(text) => setBook({ ...book, pages: text })}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveBook}>
          <Text style={styles.buttonText}>Save Book</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Genre" component={GenreScreen} />
        <Stack.Screen name="AddBook" component={AddBookScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
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
});
