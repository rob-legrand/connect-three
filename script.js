/*jslint browser: true, indent: 3 */

document.addEventListener('DOMContentLoaded', function () {
   'use strict';
   var aiLevel, clickFunc, disableDropButtons, dropButtons, dropPieceInColumn, fixDropButtons, fixShowHints, getBoard, hints, makeMoveOnBoard, maxNumColumns, maxNumRows, minimaxBoardValue, minimaxMove, newGame, numColumns, numHumanPlayers, numRows, numSpacesToWin, piece0, piece1, piece2, playerToMoveNext, resizeBoard, selectAiLevelElement, selectNumColumnsElement, selectNumRowsElement, showHintsCheckbox, spaces, unmakeMoveOnBoard, winnerOnBoard;

   maxNumColumns = 5;
   maxNumRows = 5;
   selectNumColumnsElement = document.getElementById('select-num-columns');
   numColumns = parseInt(selectNumColumnsElement.options[selectNumColumnsElement.selectedIndex].value, 10);
   selectNumRowsElement = document.getElementById('select-num-rows');
   numRows = parseInt(selectNumRowsElement.options[selectNumRowsElement.selectedIndex].value, 10);
   selectAiLevelElement = document.getElementById('select-ai-level');
   aiLevel = parseInt(selectAiLevelElement.options[selectAiLevelElement.selectedIndex].value, 10);
   showHintsCheckbox = document.getElementById('show-hints');
   numSpacesToWin = 3;
   numHumanPlayers = 1;
   dropButtons = [document.getElementById('drop1'), document.getElementById('drop2'), document.getElementById('drop3'), document.getElementById('drop4'), document.getElementById('drop5')];
   spaces = [[document.getElementById('r1c1'), document.getElementById('r2c1'), document.getElementById('r3c1'), document.getElementById('r4c1'), document.getElementById('r5c1')],
             [document.getElementById('r1c2'), document.getElementById('r2c2'), document.getElementById('r3c2'), document.getElementById('r4c2'), document.getElementById('r5c2')],
             [document.getElementById('r1c3'), document.getElementById('r2c3'), document.getElementById('r3c3'), document.getElementById('r4c3'), document.getElementById('r5c3')],
             [document.getElementById('r1c4'), document.getElementById('r2c4'), document.getElementById('r3c4'), document.getElementById('r4c4'), document.getElementById('r5c4')],
             [document.getElementById('r1c5'), document.getElementById('r2c5'), document.getElementById('r3c5'), document.getElementById('r4c5'), document.getElementById('r5c5')]];
   hints = [document.getElementById('hint1'), document.getElementById('hint2'), document.getElementById('hint3'), document.getElementById('hint4'), document.getElementById('hint5')];
   spaces[0][0].src = 'stags.gif';
   piece1 = spaces[0][0].src;
   spaces[0][0].src = 'hawks.gif';
   piece2 = spaces[0][0].src;
   spaces[0][0].src = (
      matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark.gif'
      : 'empty.gif'
   );
   piece0 = spaces[0][0].src;

   matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      var column, row;
      for (column = 0; column < numColumns; column += 1) {
         for (row = 0; row < numRows; row += 1) {
            if (spaces[column][row].src !== piece1 && spaces[column][row].src !== piece2) {
               spaces[column][row].src = (
                  matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark.gif'
                  : 'empty.gif'
               );
               piece0 = spaces[column][row].src;
            }
         }
      }
   });

   resizeBoard = function () {
      var column, row;
      for (column = 0; column < maxNumColumns; column += 1) {
         dropButtons[column].style.display = column < numColumns ? '' : 'none';
         for (row = 0; row < maxNumRows; row += 1) {
            spaces[column][row].style.display = column < numColumns && row < numRows ? '' : 'none';
         }
         hints[column].textContent = '';
      }
   };
   resizeBoard();

   disableDropButtons = function () {
      var column;
      for (column = 0; column < numColumns; column += 1) {
         dropButtons[column].disabled = true;
      }
   };

   fixDropButtons = function () {
      var column;
      for (column = 0; column < numColumns; column += 1) {
         dropButtons[column].disabled = spaces[column][numRows - 1].src !== piece0;
      }
   };

   fixShowHints = function () {
      var column;
      for (column = 0; column < numColumns; column += 1) {
         hints[column].style.display = showHintsCheckbox.checked ? '' : 'none';
      }
   };
   fixShowHints();

   dropPieceInColumn = function (column) {
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

   getBoard = function () {
      var board, column, row;
      board = [];
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

   winnerOnBoard = function (board) {
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

   makeMoveOnBoard = function (board, player, column) {
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

   unmakeMoveOnBoard = function (board, column) {
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

   minimaxBoardValue = function minimaxBoardValue(board, playerToMoveNext, depth) {
      var bestOutcome, column, outcome, value;
      bestOutcome = playerToMoveNext === 1 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
      if (winnerOnBoard(board) === 1) {
         return {minimaxOutcome: 1, minimaxDepth: depth};
      }
      if (winnerOnBoard(board) === 2) {
         return {minimaxOutcome: -1, minimaxDepth: depth};
      }
      if (winnerOnBoard(board) === 3) {
         return {minimaxOutcome: 0, minimaxDepth: depth};
      }
      if (depth === 0) {
         return {minimaxOutcome: 0, minimaxDepth: depth};
      }
      for (column = 0; column < numColumns; column += 1) {
         if (makeMoveOnBoard(board, playerToMoveNext, column)) {
            value = minimaxBoardValue(board, playerToMoveNext === 1 ? 2 : 1, depth - 1);
            outcome = value.minimaxOutcome;
            if (playerToMoveNext === 1 ? outcome > bestOutcome : outcome < bestOutcome) {
               bestOutcome = outcome;
            }
            unmakeMoveOnBoard(board, column);
         }
      }
      return {minimaxOutcome: bestOutcome, minimaxDepth: 98};
   };

   minimaxMove = function () {
      var bestColumns, bestOutcome, board, column, outcome;
      bestColumns = [];
      bestOutcome = playerToMoveNext === 1 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
      board = getBoard();
      for (column = 0; column < numColumns; column += 1) {
         if (makeMoveOnBoard(board, playerToMoveNext, column)) {
            outcome = aiLevel > 0 ? minimaxBoardValue(board, playerToMoveNext === 1 ? 2 : 1, aiLevel - 1).minimaxOutcome : 0;
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

   newGame = function newGame() {
      var column, row, winner;
      for (column = 0; column < numColumns; column += 1) {
         for (row = 0; row < numRows; row += 1) {
            spaces[column][row].src = piece0;
         }
         hints[column].textContent = '';
      }
      playerToMoveNext = 1;
      document.getElementById('instructions').textContent = 'Can you get three in a row before I do?';
      fixDropButtons();
   };
   newGame();

   clickFunc = function (column) {
      return function () {
         var board, c, val, winner;
         dropPieceInColumn(column);
         for (c = 0; c < numColumns; c += 1) {
            hints[c].textContent = '';
         }
         winner = winnerOnBoard(getBoard());
         if (winner > 0) {
            disableDropButtons();
            if (winner === 1) {
               document.getElementById('instructions').textContent = 'You win!\u00a0 Play again?';
            } else if (winner === 2) {
               document.getElementById('instructions').textContent = 'I win!\u00a0 Play again?';
            } else {
               document.getElementById('instructions').textContent = 'It\'s a draw.\u00a0 Play again?';
            }
            disableDropButtons();
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
                     document.getElementById('instructions').textContent = 'You win!\u00a0 Play again?';
                  } else if (winner === 2) {
                     document.getElementById('instructions').textContent = 'I win!\u00a0 Play again?';
                  } else {
                     document.getElementById('instructions').textContent = 'It\'s a draw.\u00a0 Play again?';
                  }
                  disableDropButtons();
               } else {
                  playerToMoveNext = playerToMoveNext === 1 ? 2 : 1;
                  fixDropButtons();
               }
            }
         }
         disableDropButtons();
         winner = winnerOnBoard(getBoard());
         if (winner === 0) {
            for (c = 0; c < numColumns; c += 1) {
               board = getBoard();
               if (makeMoveOnBoard(board, playerToMoveNext, c)) {
                  val = minimaxBoardValue(board, playerToMoveNext === 1 ? 2 : 1, numColumns <= 3 ? 15 : numColumns <= 4 ? 9 : 6).minimaxOutcome;
                  if (val < -0.5) {
                     hints[c].textContent = 'L';
                  } else if (val > 0.5) {
                     hints[c].textContent = 'W';
                  } else {
                     hints[c].textContent = 'D';
                  }
               } else {
                  hints[c].textContent = '';
               }
            }
            fixDropButtons();
         }
      };
   };

   (function () {
      var column;
      for (column = 0; column < maxNumColumns; column += 1) {
         dropButtons[column].addEventListener('click', clickFunc(column));
      }
   }());

   selectNumColumnsElement.addEventListener('change', function () {
      numColumns = parseInt(selectNumColumnsElement.options[selectNumColumnsElement.selectedIndex].value, 10);
      resizeBoard();
      newGame();
   });

   selectNumRowsElement.addEventListener('change', function () {
      numRows = parseInt(selectNumRowsElement.options[selectNumRowsElement.selectedIndex].value, 10);
      resizeBoard();
      newGame();
   });

   selectAiLevelElement.addEventListener('change', function () {
      aiLevel = parseInt(selectAiLevelElement.options[selectAiLevelElement.selectedIndex].value, 10);
   });

   showHintsCheckbox.addEventListener('click', fixShowHints);
   document.getElementById('new-game').addEventListener('click', newGame);
});
