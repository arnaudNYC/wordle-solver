import { useRef, useEffect, useState } from "react";
import "./App.css";
import words from "an-array-of-english-words";

const fiveLetterWords = words.filter((word) => word.length === 5);

function App() {
  const [placed, setPlaced] = useState<string[]>(["", "", "", "", ""]);
  const [misplaced, setMisplaced] = useState<string[]>(["", "", "", "", ""]);
  const [bad, setBad] = useState<string>("");

  const inputs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const clear = () => {
    setPlaced(["", "", "", "", ""]);
    setMisplaced(["", "", "", "", ""]);
    setBad("");
  };

  return (
    <>
      <h1>Wordle Solver</h1>
      <div className="container">
        <h2>Placed letters</h2>
        <div className="horizontal">
          {placed.map((letter, idx) => {
            return (
              <input
                onChange={(evt) => {
                  const { value } = evt.currentTarget;
                  const newGood = [...placed];
                  newGood[idx] = `${value}`.toLowerCase();
                  setPlaced(newGood);
                  if (value.length === 1) {
                    inputs.current[idx + 1]?.focus();
                  } else {
                    inputs.current[idx - 1]?.focus();
                  }
                }}
                className="letter good"
                value={letter}
                key={idx}
                maxLength={1}
                ref={(el) => {
                  if (el) {
                    inputs.current[idx] = el;
                  }
                }}
                onKeyUp={(evt) => {
                  const { key } = evt;
                  if (key === "Backspace" && letter === "") {
                    inputs.current[idx - 1]?.focus();
                  }
                }}
              ></input>
            );
          })}
        </div>
        <h2>Misplaced letters</h2>
        <div className="horizontal">
          {misplaced.map((letter, idx) => {
            return (
              <input
                onChange={(evt) => {
                  const { value } = evt.currentTarget;
                  const newMisplaced = [...misplaced];
                  newMisplaced[idx] = `${value}`.toLowerCase();
                  setMisplaced(newMisplaced);
                  if (value.length === 1) {
                    inputs.current[Math.min(idx + 6, 9)]?.focus();
                  } else {
                    inputs.current[idx + 4]?.focus();
                  }
                }}
                className="letter misplaced"
                value={letter}
                key={idx}
                maxLength={1}
                ref={(el) => {
                  if (el) {
                    inputs.current[idx + 5] = el;
                  }
                }}
                onKeyUp={(evt) => {
                  const { key } = evt;
                  if (key === "Backspace" && letter === "") {
                    inputs.current[idx + 4]?.focus();
                  }
                }}
              ></input>
            );
          })}
        </div>
        <h2>Bad letters</h2>
        <div className="horizontal">
          <input
            className="letter bad"
            value={bad}
            onChange={(e) => setBad(`${e.currentTarget.value}`.toLowerCase())}
          />
        </div>
        <PossibleSolutions placed={placed} misplaced={misplaced} bad={bad} />
        <button className="clearButton" onClick={clear}>
          Clear
        </button>
      </div>
      <div>
        {"Made with ❤️ in 🗽 - "}
        <a href="https://github.com/arnaudNYC/wordle-solver">github</a>
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
        // account for duplicate letters
        for (let j = 0; j < wordLetters.length; j++) {
          if (wordLetters[j] === bad[i] && placed[j] !== bad[i]) {
            return false;
          }
        }
      }
    }
    // could be a solution
    return true;
  });

  return (
    <>
      <h2>Possible solutions</h2>
      <div className="text-large">
        <ShowSolutions solutions={possibleSolutions} />
      </div>
    </>
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
