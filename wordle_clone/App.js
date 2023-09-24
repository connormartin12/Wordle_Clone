import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from './app/config/constants';
import Keyboard from './app/components/Keyboard';
import words from './app/config/five_letter_words';

const numberOfGuesses = 6;

function getWord() {
  // Get random word from list
  let length = words.length;
  wordPosition = Math.floor(Math.random() * length);
  return words[wordPosition];
}

function checkGuessValidity(userGuess) {
  // Check that guess is a word in the list
  checkWord = userGuess.join("");
  return words.some(word => word === checkWord);
}

function playWordle() {
  let word = getWord();
  // for (let i = 0; i < 6; i++) {
  //   // Wait for user to input guess. Don't let user input guess that is less than or greater than 5 characters
  //   // Only let user input A-Z character, Backspace and Enter
  // }
}

const copyArray = (arr) => {
  return [...(arr.map(rows => [...rows]))];
};

export default function App() {
  // playWordle();
  const word = 'spare'
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(numberOfGuesses).fill(new Array(letters.length).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows);
    if (key === "CLEAR") {
      if (currentCol > 0)
        setCurrentCol(currentCol - 1);
      updatedRows[currentRow][currentCol-1] = '';
    } else if (key === "ENTER") {
      if (currentCol === 5) {
        let valid = checkGuessValidity(updatedRows[currentRow]);
        if (valid) {
          setCurrentCol(0);
          setCurrentRow(currentRow + 1);
        } else {
          console.log("Not in word list");
        }
      } else {
        // Animation saying not enough letters
        console.log("Not enough letters");
      }
    } else if ((currentCol <= 4 && (currentRow <= 5))) {
      updatedRows[currentRow][currentCol] = key;
      setCurrentCol(currentCol + 1);
    }
    setRows(updatedRows);
  };

  const isLetterBoxActive = (row, col) => {
    return row === currentRow && col === currentCol;
  };

  const getCellBGColor = (row, column) => {
    const letter = rows[row][column];
    if (row >= currentRow)
      return "white";
    if (letter === letters[column])
      return colors.primary;
    else if (letters.includes(letter))
      return colors.secondary;
    return colors.grey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.grey);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Wordle</Text>
        
        <View style={styles.wordleBoard}>
          {rows.map((row, i) => (
            <View key={`row-${i}`} style={styles.wordRow}>
              {row.map((cell, j) => (
                <View 
                  key={`cell-${i}-${j}`}
                  style={[
                    styles.letterBox, 
                    {
                      borderColor: isLetterBoxActive(i, j) ? 
                      colors.grey : 
                      colors.lightgrey,
                      backgroundColor: getCellBGColor(i, j)
                    },
                  ]}>
                  <Text style={styles.letter}>{cell.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      <View style={styles.keyboard}>
        <Keyboard 
          onKeyPressed={onKeyPressed} 
          greenCaps={greenCaps}
          yellowCaps={yellowCaps}
          greyCaps={greyCaps}   
        />        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: '5%',
  },
  keyboard: {
    marginBottom: 20,
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  letterBox: {
    alignItems: 'center',
    borderColor: colors.lightgrey,
    borderWidth: 2,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    margin: 20,
  },
  wordleBoard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  wordRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 4
  },
});
