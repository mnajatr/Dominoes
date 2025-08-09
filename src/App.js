import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const initialTiles = [
    [6, 1],
    [4, 3],
    [5, 1],
    [3, 4],
    [1, 1],
    [3, 4],
    [1, 2],
  ];

  const total = ([a, b]) => a + b;
  const minPip = ([a, b]) => Math.min(a, b);
  const maxPip = ([a, b]) => Math.max(a, b);

  const [tiles, setTiles] = useState(initialTiles);
  const [targetTotal, setTargetTotal] = useState("");

  function countDoubles(list) {
    return list.filter(([a, b]) => a === b).length;
  }

  function flipAll() {
    setTiles((prev) => prev.map(([a, b]) => [b, a]));
  }

  function resetTiles() {
    setTiles(initialTiles);
  }

  function sortAsc() {
    setTiles((prev) => {
      const copy = [...prev];
      copy.sort(
        (p, q) =>
          total(p) - total(q) || minPip(p) - minPip(q) || maxPip(q) - maxPip(q)
      );
      return copy;
    });
  }

  function sortDesc() {
    setTiles((prev) => {
      const copy = [...prev];
      copy.sort(
        (p, q) =>
          total(q) - total(p) || minPip(q) - minPip(p) || maxPip(q) - maxPip(p)
      );
      return copy;
    });
  }

  function removeDuplicatesGroups() {
    setTiles((prev) => {
      const freq = new Map();
      for (const [a, b] of prev) {
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        freq.set(key, (freq.get(key) || 0) + 1);
      }
      return prev.filter(([a, b]) => {
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        return freq.get(key) === 1;
      });
    });
  }

  function removeByTotal() {
    const n = parseInt(targetTotal, 10);

    if (Number.isNaN(n)) {
      return;
    }

    if (n < 0) {
      return;
    }

    setTiles((prev) => prev.filter((tile) => total(tile) !== n));

    setTargetTotal("");
  }

  return (
    <div className="app">
      <h1>Dominoes</h1>

      <section className="panel">
        <h2>Source</h2>
        <div className="mono">{JSON.stringify(tiles)}</div>
      </section>

      <section className="panel">
        <h2>Double Numbers</h2>
        <div className="mono">{countDoubles(tiles)}</div>
      </section>

      <div className="tiles">
        {tiles.map(([a, b], i) => (
          <div className="domino" key={`${a}-${b}-${i}`}>
            <div className="pip">{a}</div>
            <div className="dash">&mdash;</div>
            <div className="pip">{b}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button type="button" onClick={sortAsc}>
          Sort (ASC)
        </button>
        <button type="button" onClick={sortDesc}>
          Sort (DESC)
        </button>
        <button type="button" onClick={flipAll}>
          Flip
        </button>
        <button type="button" onClick={removeDuplicatesGroups}>
          Remove Dup
        </button>
        <button type="button" onClick={resetTiles}>
          Reset
        </button>
      </div>

      <form
        className="remove"
        onSubmit={(e) => {
          e.preventDefault();
          removeByTotal();
        }}
      >
        <input
          type="number"
          placeholder="Input number"
          aria-label="Input number"
          value={targetTotal}
          onChange={(e) => setTargetTotal(e.target.value)}
        />
        <button type="submit">Remove</button>
      </form>
    </div>
  );
}
