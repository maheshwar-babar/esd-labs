// The whole app: App → Header, Matrix → Cell, Stats.
// App owns the numbers. Matrix and Stats only receive them as props.
import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt, decrementAt, zeros } from "./matrix.js";

export default function App() {
  // Section 07: hold the matrix in state, starting from START, and render
  //             <Matrix matrix={…} /> under the header.
  // Section 08: write increment(row, col): it calls the setter with incrementAt.
  //             Pass it down to Matrix as onIncrement.
  // Section 09: render <Stats matrix={…} /> NEXT TO the matrix, not inside it.
  // Section 11: load /matrix.json once, in a useEffect, and put it in the state.

  const [matrix, setMatrix] = useState(START);

  function increment(row,col){
    setMatrix(current=>incrementAt(current,row,col));
  }

  useEffect(() => {
    async function loadMatrix() {
      const response = await fetch("/matrix.json");
      if (!response.ok) {
        throw new Error(`Failed to load matrix: ${response.status}`);
      }
  
      const data = await response.json();
      setMatrix(data);
    }
  
    loadMatrix().catch((error) => {
      console.error("Could not load /matrix.json:", error);
    });
  }, []);

  return (
    <main className="app">
      <Header />
      <Matrix matrix={matrix} onIncrement={increment}/>
      <Stats matrix={matrix}/>
    </main>
  );
}