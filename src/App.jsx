import { useState, useEffect } from 'react'

function Square({value, onSquareClick, isWinner}) {
  return (
    <button 
      className={`square ${isWinner ? 'winner' : ''}`} 
      onClick={onSquareClick}
    >
      {value === 'X' && (
        <span className="x-symbol">
          <span className="x-line x-line-1"></span>
          <span className="x-line x-line-2"></span>
        </span>
      )}
      {value === 'O' && (
        <span className="o-symbol"></span>
      )}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const [winningSquares, setWinningSquares] = useState([null, null, null]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();

    nextSquares[i] = (xIsNext ? 'X' : 'O');
    onPlay(nextSquares);
  }

  const winInfo = calculateWinner(squares);
  let status = '';
  
  useEffect(() => {
    if (winInfo) {
      setWinningSquares(winInfo.line);
    } else {
      setWinningSquares([null, null, null]);
    }
  }, [winInfo]);

  if (winInfo) {
    status = 'Winner: ' + winInfo.winner;
  } else if (!squares.includes(null)) {
    status = 'Game Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    return (
      <Square 
        value={squares[i]} 
        onSquareClick={() => handleClick(i)}
        isWinner={winningSquares.includes(i)}
      />
    );
  };

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = (currentMove % 2) === 0;
  const currentSquares = history[currentMove];
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description = '';
    if(move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <h1 className="game-title">Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
          <button className="reset-button" onClick={resetGame}>Reset Game</button>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }
  return null;
}