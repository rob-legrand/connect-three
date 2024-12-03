/*jslint browser: true, vars: true, indent: 3 */

(function () {
   'use strict';

   var maxNumColumns = 5;
   var maxNumRows = 5;
   var selectNumColumnsElement = document.getElementById('select-num-columns');
   var numColumns = parseInt(selectNumColumnsElement.options[selectNumColumnsElement.selectedIndex].value, 10);
   var selectNumRowsElement = document.getElementById('select-num-rows');
   var numRows = parseInt(selectNumRowsElement.options[selectNumRowsElement.selectedIndex].value, 10);
   var selectAiLevelElement = document.getElementById('select-ai-level');
   var aiLevel = parseInt(selectAiLevelElement.options[selectAiLevelElement.selectedIndex].value, 10);
   var showHintsCheckbox = document.getElementById('show-hints');
   var numSpacesToWin = 3;
   var numHumanPlayers = 1;
   var playerToMoveNext;
   var dropButtons = [document.getElementById('drop1'), document.getElementById('drop2'), document.getElementById('drop3'), document.getElementById('drop4'), document.getElementById('drop5')];
   var spaces = [[document.getElementById('r1c1'), document.getElementById('r2c1'), document.getElementById('r3c1'), document.getElementById('r4c1'), document.getElementById('r5c1')],
                 [document.getElementById('r1c2'), document.getElementById('r2c2'), document.getElementById('r3c2'), document.getElementById('r4c2'), document.getElementById('r5c2')],
                 [document.getElementById('r1c3'), document.getElementById('r2c3'), document.getElementById('r3c3'), document.getElementById('r4c3'), document.getElementById('r5c3')],
                 [document.getElementById('r1c4'), document.getElementById('r2c4'), document.getElementById('r3c4'), document.getElementById('r4c4'), document.getElementById('r5c4')],
                 [document.getElementById('r1c5'), document.getElementById('r2c5'), document.getElementById('r3c5'), document.getElementById('r4c5'), document.getElementById('r5c5')]];
   var hints = [document.getElementById('hint1'), document.getElementById('hint2'), document.getElementById('hint3'), document.getElementById('hint4'), document.getElementById('hint5')];
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
         hints[column].innerHTML = '';
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

   var fixShowHints = function () {
      var column;
      for (column = 0; column < numColumns; column += 1) {
         hints[column].style.display = showHintsCheckbox.checked ? '' : 'none';
      }
   };
   fixShowHints();

   var dropPieceInColumn = function (column) {
      var row;
      if (column >= 0 && column < numColumns) {
         for (row = 0; row < numRows; row += 1) {
            if (spaces[column][row].src === piece0) {
               spaces[column][row].src = playerToMoveNext === 1 ? piece1 : piece2;
               return true;
            }
         }
      }
      return false;
   };

   var getBoard = function () {
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

   var winnerOnBoard = function (board) {
      var column, row, winner, whichSpace;
      if (numRows >= numSpacesToWin) {
         for (column = 0; column < numColumns; column += 1) {
            for (row = 0; row <= numRows - numSpacesToWin; row += 1) {
               winner = board[column][row];
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (board[column][row + whichSpace] !== winner) {
                     winner = 0;
                  }
               }
               if (winner !== 0) {
                  return winner;
               }
            }
         }
      }
      if (numColumns >= numSpacesToWin) {
         for (column = 0; column <= numColumns - numSpacesToWin; column += 1) {
            for (row = 0; row < numRows; row += 1) {
               winner = board[column][row];
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (board[column + whichSpace][row] !== winner) {
                     winner = 0;
                  }
               }
               if (winner !== 0) {
                  return winner;
               }
            }
         }
      }
      if (numRows >= numSpacesToWin && numColumns >= numSpacesToWin) {
         for (column = 0; column <= numColumns - numSpacesToWin; column += 1) {
            for (row = 0; row <= numRows - numSpacesToWin; row += 1) {
               winner = board[column][row];
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (board[column + whichSpace][row + whichSpace] !== winner) {
                     winner = 0;
                  }
               }
               if (winner !== 0) {
                  return winner;
               }
            }
         }
         for (column = 0; column <= numColumns - numSpacesToWin; column += 1) {
            for (row = numSpacesToWin - 1; row < numRows; row += 1) {
               winner = board[column][row];
               for (whichSpace = 1; whichSpace < numSpacesToWin; whichSpace += 1) {
                  if (board[column + whichSpace][row - whichSpace] !== winner) {
                     winner = 0;
                  }
               }
               if (winner !== 0) {
                  return winner;
               }
            }
         }
      }
      for (column = 0; column < numColumns; column += 1) {
         for (row = 0; row < numRows; row += 1) {
            if (board[column][row] === 0) {
               return 0;
            }
         }
      }
      return 3;
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

   var minimaxBoardValue = function minimaxBoardValue(board, playerToMoveNext, depth) {
      var bestOutcome = playerToMoveNext === 1 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
      var column, outcome;
      if (winnerOnBoard(board) === 1) {
         return 1;
      }
      if (winnerOnBoard(board) === 2) {
         return -1;
      }
      if (winnerOnBoard(board) === 3) {
         return 0;
      }
      if (depth === 0) {
         return 0;
      }
      for (column = 0; column < numColumns; column += 1) {
         if (makeMoveOnBoard(board, playerToMoveNext, column)) {
            outcome = minimaxBoardValue(board, playerToMoveNext === 1 ? 2 : 1, depth - 1);
            if (playerToMoveNext === 1 ? outcome > bestOutcome : outcome < bestOutcome) {
               bestOutcome = outcome;
            }
            unmakeMoveOnBoard(board, column);
         }
      }
      return bestOutcome;
   };

   var minimaxMove = function () {
      var bestColumns = [];
      var bestOutcome = playerToMoveNext === 1 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
      var board = getBoard();
      var column, outcome;
      for (column = 0; column < numColumns; column += 1) {
         if (makeMoveOnBoard(board, playerToMoveNext, column)) {
            outcome = aiLevel > 0 ? minimaxBoardValue(board, playerToMoveNext === 1 ? 2 : 1, aiLevel - 1) : 0;
            if (playerToMoveNext === 1 ? outcome > bestOutcome : outcome < bestOutcome) {
               bestColumns = [column];
               bestOutcome = outcome;
            } else if (outcome === bestOutcome) {
               bestColumns.push(column);
            }
            unmakeMoveOnBoard(board, column);
         }
      }
      return bestColumns[Math.floor(bestColumns.length * Math.random())];
   };

   var newGame = function newGame() {
      var column, row, winner;
      for (column = 0; column < numColumns; column += 1) {
         for (row = 0; row < numRows; row += 1) {
            spaces[column][row].src = piece0;
         }
         hints[column].innerHTML = '';
      }
      playerToMoveNext = 1;
   };
   newGame();

   var clickFunc = function (column) {
      return function () {
         var winner;
         var board, val, c;
         dropPieceInColumn(column);
         for (c = 0; c < numColumns; c += 1) {
            hints[c].innerHTML = '';
         }
         winner = winnerOnBoard(getBoard());
         if (winner > 0) {
            disableDropButtons();
            if (winner === 1) {
               window.alert('You win!  Play again?');
            } else if (winner === 2) {
               window.alert('I win!  Play again?');
            } else {
               window.alert('It\'s a draw.  Play again?');
            }
            newGame();
         } else {
            playerToMoveNext = playerToMoveNext === 1 ? 2 : 1;
            fixDropButtons();
            if (numHumanPlayers === 1) {
               disableDropButtons();
               dropPieceInColumn(minimaxMove());
               winner = winnerOnBoard(getBoard());
               if (winner > 0) {
                  disableDropButtons();
                  if (winner === 1) {
                     window.alert('You win!  Play again?');
                  } else if (winner === 2) {
                     window.alert('I win!  Play again?');
                  } else {
                     window.alert('It\'s a draw.  Play again?');
                  }
                  newGame();
               } else {
                  playerToMoveNext = playerToMoveNext === 1 ? 2 : 1;
                  fixDropButtons();
               }
            }
         }
         disableDropButtons();
         for (c = 0; c < numColumns; c += 1) {
            board = getBoard();
            if (makeMoveOnBoard(board, playerToMoveNext, c)) {
               val = minimaxBoardValue(board, playerToMoveNext === 1 ? 2 : 1, numColumns <= 3 ? 15 : numColumns <= 4 ? 9 : 6);
               if (val < -0.5) {
                  hints[c].innerHTML = 'L';
               } else if (val > 0.5) {
                  hints[c].innerHTML = 'W';
               } else {
                  hints[c].innerHTML = 'D';
               }
            } else {
               hints[c].innerHTML = '';
            }
         }
         fixDropButtons();
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

   selectAiLevelElement.onchange = function () {
      aiLevel = parseInt(selectAiLevelElement.options[selectAiLevelElement.selectedIndex].value, 10);
   };

   showHintsCheckbox.onclick = fixShowHints;
   document.getElementById('new-game').onclick = newGame;
}());
