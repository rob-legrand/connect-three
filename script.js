/*jslint browser: true, vars: true, indent: 3 */

(function () {
   'use strict';

   var maxNumColumns = 5;
   var maxNumRows = 5;
   var selectNumColumnsElement = document.getElementById('select-num-columns');
   var numColumns = parseInt(selectNumColumnsElement.options[selectNumColumnsElement.selectedIndex].value, 10);
   var selectNumRowsElement = document.getElementById('select-num-rows');
   var numRows = parseInt(selectNumRowsElement.options[selectNumRowsElement.selectedIndex].value, 10);
   var numSpacesToWin = 3;
   var numHumanPlayers = 1;
   var isFirstPlayersTurn;
   var dropButtons = [document.getElementById('drop1'), document.getElementById('drop2'), document.getElementById('drop3'), document.getElementById('drop4'), document.getElementById('drop5')];
   var spaces = [[document.getElementById('r1c1'), document.getElementById('r2c1'), document.getElementById('r3c1'), document.getElementById('r4c1'), document.getElementById('r5c1')],
                 [document.getElementById('r1c2'), document.getElementById('r2c2'), document.getElementById('r3c2'), document.getElementById('r4c2'), document.getElementById('r5c2')],
                 [document.getElementById('r1c3'), document.getElementById('r2c3'), document.getElementById('r3c3'), document.getElementById('r4c3'), document.getElementById('r5c3')],
                 [document.getElementById('r1c4'), document.getElementById('r2c4'), document.getElementById('r3c4'), document.getElementById('r4c4'), document.getElementById('r5c4')],
                 [document.getElementById('r1c5'), document.getElementById('r2c5'), document.getElementById('r3c5'), document.getElementById('r4c5'), document.getElementById('r5c5')]];
   spaces[0][0].src = 'stags.gif';
   var piece1 = spaces[0][0].src;
   spaces[0][0].src = 'hawks.gif';
   var piece2 = spaces[0][0].src;
   spaces[0][0].src = 'empty.gif';
   var piece0 = spaces[0][0].src;

   var resizeBoard = function () {
      var column, row;
      for (column = 0; column < maxNumColumns; column += 1) {
         dropButtons[column].style.display = column < numColumns ? '' : 'none';
         for (row = 0; row < maxNumRows; row += 1) {
            spaces[column][row].style.display = column < numColumns && row < numRows ? '' : 'none';
         }
      }
   };
   resizeBoard();

   var disableDropButtons = function () {
      var column;
      for (column = 0; column < numColumns; column += 1) {
         dropButtons[column].disabled = true;
      }
   };

   var fixDropButtons = function () {
      var column;
      for (column = 0; column < numColumns; column += 1) {
         dropButtons[column].disabled = spaces[column][numRows - 1].src !== piece0;
      }
   };

   var dropPieceInColumn = function (column) {
      var row;
      if (column >= 0 && column < numColumns) {
         for (row = 0; row < numRows; row += 1) {
            if (spaces[column][row].src === piece0) {
               spaces[column][row].src = isFirstPlayersTurn ? piece1 : piece2;
               return true;
            }
         }
      }
      return false;
   };

   var winnerOnBoard = function () {
      var column, row, winner, whichSpace;
      if (numRows >= numSpacesToWin) {
         for (column = 0; column < numColumns; column += 1) {
            for (row = 0; row <= numRows - numSpacesToWin; row += 1) {
               winner = spaces[column][row].src;
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (spaces[column][row + whichSpace].src !== winner) {
                     winner = piece0;
                  }
               }
               if (winner !== piece0) {
                  return winner;
               }
            }
         }
      }
      if (numColumns >= numSpacesToWin) {
         for (column = 0; column <= numColumns - numSpacesToWin; column += 1) {
            for (row = 0; row < numRows; row += 1) {
               winner = spaces[column][row].src;
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (spaces[column + whichSpace][row].src !== winner) {
                     winner = piece0;
                  }
               }
               if (winner !== piece0) {
                  return winner;
               }
            }
         }
      }
      if (numRows >= numSpacesToWin && numColumns >= numSpacesToWin) {
         for (column = 0; column <= numColumns - numSpacesToWin; column += 1) {
            for (row = 0; row <= numRows - numSpacesToWin; row += 1) {
               winner = spaces[column][row].src;
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (spaces[column + whichSpace][row + whichSpace].src !== winner) {
                     winner = piece0;
                  }
               }
               if (winner !== piece0) {
                  return winner;
               }
            }
         }
         for (column = 0; column <= numColumns - numSpacesToWin; column += 1) {
            for (row = numSpacesToWin - 1; row < numRows; row += 1) {
               winner = spaces[column][row].src;
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (spaces[column + whichSpace][row - whichSpace].src !== winner) {
                     winner = piece0;
                  }
               }
               if (winner !== piece0) {
                  return winner;
               }
            }
         }
      }
      for (column = 0; column < numColumns; column += 1) {
         for (row = 0; row < numRows; row += 1) {
            if (spaces[column][row].src === piece0) {
               return piece0;
            }
         }
      }
      return 'draw';
   };

   var getBoardAsArray = function () {
      var column, row;
      var board = [];
      for (column = 0; column < numColumns; column += 1) {
         board[column] = [];
         for (row = 0; row < numRows; row += 1) {
            if (spaces[column][row].src === piece1) {
               board[column][row] = 1;
            } else if (spaces[column][row].src === piece2) {
               board[column][row] = 2;
            } else {
               board[column][row] = 0;
            }
         }
      }
      return board;
   };

   var makeMoveOnBoard = function (board, player, column) {
      var row;
      if (column >= 0 && column < numColumns) {
         for (row = 0; row < numRows; row += 1) {
            if (board[column][row] === 0) {
               board[column][row] = player;
               return true;
            }
         }
      }
      return false;
   };

   var unmakeMoveOnBoard = function (board, column) {
      var row;
      if (column >= 0 && column < numColumns) {
         for (row = numRows - 1; row >= 0; row -= 1) {
            if (board[column][row] > 0) {
               board[column][row] = 0;
               return true;
            }
         }
      }
      return false;
   };

   var randomLegalMove = function () {
      var column;
      do {
         column = Math.floor(numColumns * Math.random());
      } while (spaces[column][numRows - 1].src !== piece0);
      return column;
   };

   var newGame = function newGame() {
      var column, row, winner;
      for (column = 0; column < numColumns; column += 1) {
         for (row = 0; row < numRows; row += 1) {
            spaces[column][row].src = piece0;
         }
      }
      fixDropButtons();
      isFirstPlayersTurn = false;
      if (numHumanPlayers === 1) {
         disableDropButtons();
         dropPieceInColumn(randomLegalMove());
         winner = winnerOnBoard();
         if (winner !== piece0) {
            disableDropButtons();
            if (winner === piece1) {
               window.alert('Player 1 wins.');
            } else if (winner === piece2) {
               window.alert('Player 2 wins.');
            } else {
               window.alert('It\'s a draw.  Play again?');
            }
            newGame();
         } else {
            fixDropButtons();
            isFirstPlayersTurn = !isFirstPlayersTurn;
         }
      }
   };

   newGame();

   var clickFunc = function (column) {
      return function () {
         var winner;
         dropPieceInColumn(column);
         winner = winnerOnBoard();
         if (winner !== piece0) {
            disableDropButtons();
            if (winner === piece1) {
               window.alert('You win!  Play again?');
            } else if (winner === piece2) {
               window.alert('I win!  Play again?');
            } else {
               window.alert('It\'s a draw.  Play again?');
            }
            newGame();
         } else {
            fixDropButtons();
            isFirstPlayersTurn = !isFirstPlayersTurn;
            if (numHumanPlayers === 1) {
               disableDropButtons();
               dropPieceInColumn(randomLegalMove());
               winner = winnerOnBoard();
               if (winner !== piece0) {
                  disableDropButtons();
                  if (winner === piece1) {
                     window.alert('You win!  Play again?');
                  } else if (winner === piece2) {
                     window.alert('I win!  Play again?');
                  } else {
                     window.alert('It\'s a draw.  Play again?');
                  }
                  newGame();
               } else {
                  fixDropButtons();
                  isFirstPlayersTurn = !isFirstPlayersTurn;
               }
            }
         }
      };
   };

   var column;
   for (column = 0; column < maxNumColumns; column += 1) {
      dropButtons[column].onclick = clickFunc(column);
   }

   selectNumColumnsElement.onchange = function () {
      numColumns = parseInt(selectNumColumnsElement.options[selectNumColumnsElement.selectedIndex].value, 10);
      resizeBoard();
      newGame();
   };

   selectNumRowsElement.onchange = function () {
      numRows = parseInt(selectNumRowsElement.options[selectNumRowsElement.selectedIndex].value, 10);
      resizeBoard();
      newGame();
   };

   document.getElementById('new-game').onclick = newGame;
}());
