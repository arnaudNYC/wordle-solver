import React, { useState } from "react";
import "./App.css";
import words from "an-array-of-english-words";

const fiveLetterWords = words.filter((word) => word.length === 5);

function App() {
  const [placed, setPlaced] = useState<string[]>(["", "", "", "", ""]);
  const [misplaced, setMisplaced] = useState<string[]>(["", "", "", "", ""]);
  const [bad, setBad] = useState<string>("");

  const clear = () => {
    setPlaced(["", "", "", "", ""]);
    setMisplaced(["", "", "", "", ""]);
    setBad("");
  };

  return (
    <>
      <h1>Wordle Solver</h1>
      <div className="card">
        <h2>Placed letters</h2>
        {placed.map((letter, idx) => {
          return (
            <input
              onChange={(evt) => {
                const newGood = [...placed];
                newGood[idx] = evt.currentTarget.value;
                setPlaced(newGood);
              }}
              className="letter good"
              value={letter}
              key={idx}
              maxLength={1}
            ></input>
          );
        })}
      </div>
      <div className="card">
        <h2>Misplaced letters</h2>
        {misplaced.map((letter, idx) => {
          return (
            <input
              onChange={(evt) => {
                const newMisplaced = [...misplaced];
                newMisplaced[idx] = evt.currentTarget.value;
                setMisplaced(newMisplaced);
              }}
              className="letter misplaced"
              value={letter}
              key={idx}
              maxLength={1}
            ></input>
          );
        })}
      </div>
      <div className="card">
        <h2>Bad letters</h2>
        <input
          className="letter bad"
          value={bad}
          onChange={(e) => setBad(e.currentTarget.value)}
        />
      </div>
      <div className="card">
        <h2>Possible solutions</h2>
      </div>
      <div>
        <PossibleSolutions placed={placed} misplaced={misplaced} bad={bad} />
      </div>
      <div>
        <button className="clearButton" onClick={clear}>
          Clear
        </button>
      </div>
    </>
  );
}

function PossibleSolutions({
  placed,
  misplaced,
  bad,
}: {
  placed: string[];
  misplaced: string[];
  bad: string;
}) {
  let possibleSolutions: string[] = [];
  possibleSolutions = fiveLetterWords.filter((word) => {
    // remove words that don't match the placed letters
    const wordLetters = word.split("");
    for (let i = 0; i < placed.length; i++) {
      if (placed[i] && placed[i] !== wordLetters[i]) {
        return false;
      }
    }
    // remove words that don't include the misplaced letters or
    // have them in the wrong place
    for (let i = 0; i < misplaced.length; i++) {
      if (
        misplaced[i] &&
        (!wordLetters.includes(misplaced[i]) || wordLetters[i] === misplaced[i])
      ) {
        return false;
      }
    }
    // reject the word if it contains any of the bad letters
    for (let i = 0; i < bad.length; i++) {
      if (bad[i] && wordLetters.includes(bad[i])) {
        for (let j = 0; j < wordLetters.length; j++) {
          if (wordLetters[j] === bad[i] && placed[j] !== bad[i]) {
            return false;
          }
        }
      }
    }
    //
    return true;
  });

  return (
    <div className="text-large">
      <ShowSolutions solutions={possibleSolutions} />
    </div>
  );
}

function ShowSolutions({ solutions }: { solutions: string[] }) {
  if (solutions.length > 100) {
    return <div>Too many solutions ({solutions.length})</div>;
  }

  return (
    <div>
      <div>
        {solutions.length > 50
          ? `Showing 50 of ${solutions.length} possible solutions`
          : `Showing ${solutions.length} possible solutions`}
      </div>
      {solutions.join(", ")}
    </div>
  );
}

export default App;