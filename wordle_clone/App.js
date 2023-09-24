import React, { useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from './app/config/constants';
import Keyboard from './app/components/Keyboard';
import words from './app/config/five_letter_words';

const numberOfGuesses = 6;

const getWord = () => {
  let length = words.length;
  wordPosition = Math.floor(Math.random() * length);
  return words[wordPosition];
};

const checkGuessValidity = (userGuess) => {
  checkWord = userGuess.join("");
  return words.some(word => word === checkWord);
};

const checkGuess = (userGuess, word) => {
  checkWord = userGuess.join("");
  return checkWord === word;
};

const copyArray = (arr) => {
  return [...(arr.map(rows => [...rows]))];
};

export default function App() {
  // playWordle();
  const [word, setWord] = useState(getWord());
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(numberOfGuesses).fill(new Array(letters.length).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('Would you like to play agan?');

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
          let correct = checkGuess(updatedRows[currentRow], word);
          if (correct) {
            setModalText('Well done! Would you like to play again?');
            setModalVisible(true);
          }
          else if (currentRow === 5) {
            setModalText(`Oh no! The word was ${word}!`);
            setModalVisible(true);
          } 
          setErrorMessage(false);
          setCurrentCol(0);
          setCurrentRow(currentRow + 1);
        } else {
          setErrorMessage("Not in word list");
        }
      } else {
        setErrorMessage("Not enough letters");
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

  const playAgain = () => {
    setModalVisible(!modalVisible);
    setWord(getWord());
    setRows(new Array(numberOfGuesses).fill(new Array(letters.length).fill('')));
    setCurrentRow(0);
    setCurrentCol(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType = "slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => playAgain()}>
              <Text style={styles.textStyle}>Play Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
      <Text style={styles.errorMessage}>{errorMessage}</Text>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    padding: '5%',
  },
  errorMessage: {
    color: 'red',
    flex: 1,
    marginVertical: 10,
    marginTop: 20,
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
    height: 70,
    justifyContent: "center",
    width: 70,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    margin: 20,
  },
  wordleBoard: {
    alignItems: 'center',
    gap: 4,
  },
  wordRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 4
  },
});
