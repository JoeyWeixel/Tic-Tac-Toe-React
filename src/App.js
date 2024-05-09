import { useState } from 'react';

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardTiles = (() => {
    const rowArray = [];
    for(let i=0; i<3; i++){
      const tileArray = []
      for(let j=0; j<3; j++){
        const currentTile = 3*i+j;
        tileArray.push(
          <Square key={i + '-' + j} value={squares[currentTile]} onSquareClick={() => handleClick(currentTile)} />);
      }
      const row = <div key={i} className='board-row'>{tileArray}</div>
      rowArray.push(row);
    }
    return rowArray;
  })();

  return (
    <>
      <div className="status">{status}</div>
      {boardTiles}
    </>
  );
};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleToggleMovesOrder() {
    setIsAscending(!isAscending);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
    } else{
      description = 'Go to game start';
    }
    return (
      <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => handleToggleMovesOrder()}>Toggle Move Ordering</button>
        <ol key={1}>{isAscending ? moves:moves.slice().reverse()}</ol>
      </div>
    </div>
  );
}

function Square({index, value, onSquareClick}) {
  return (
    <button key={index} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}