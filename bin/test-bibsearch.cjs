// Regression coverage for debouncing, URL queries, and both search implementations.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync("assets/js/bibsearch.js", "utf8").replace(/^import[^\n]*\n/, "");

for (const highlights of [false, true]) {
  let onInput, onHash;
  let now = 0;
  let nextId = 0;
  let filters = 0;
  const timers = new Map();
  const item = {
    innerText: "Skrull NeurIPS 2025",
    hidden: false,
    classList: {
      add() {
        item.hidden = true;
      },
      remove() {
        item.hidden = false;
      },
    },
  };
  const input = { value: "", addEventListener: (_, cb) => (onInput = cb) };
  const context = {
    document: {
      addEventListener: (_, cb) => cb(),
      getElementById: () => input,
      querySelectorAll: (selector) => {
        if (selector === ".bibliography, .unloaded") {
          filters++;
          return [item];
        }
        return selector === ".bibliography > li" ? [item] : [];
      },
    },
    window: { location: { hash: "#SKRULL" }, addEventListener: (_, cb) => (onHash = cb) },
    CSS: { highlights },
    highlightSearchTerm: ({ search }) => (item.innerText.toLowerCase().includes(search) ? [] : [item]),
    decodeURIComponent,
    clearTimeout: (id) => timers.delete(id),
    setTimeout: (callback, delay) => {
      assert.equal(typeof callback, "function");
      timers.set(++nextId, { callback, due: now + delay });
      return nextId;
    },
  };
  const tick = (ms) => {
    now += ms;
    for (const [id, timer] of timers)
      if (timer.due <= now) {
        timers.delete(id);
        timer.callback();
      }
  };
  vm.runInNewContext(source, context);
  assert.equal(item.hidden, false, "uppercase URL query matches");
  filters = 0;
  input.value = "unknown";
  onInput.call(input);
  tick(150);
  input.value = "  SKRULL  ";
  onInput.call(input);
  tick(299);
  assert.equal(filters, 0, "rapid typing is debounced");
  tick(1);
  assert.equal(filters, 1);
  assert.equal(item.hidden, false);
  input.value = "unknown";
  onInput.call(input);
  context.window.location.hash = "#NeurIPS";
  onHash();
  tick(300);
  assert.equal(item.hidden, false, "URL query cancels stale input timer");
  context.window.location.hash = "#%";
  assert.doesNotThrow(onHash);
  assert.equal(item.hidden, true);
  context.window.location.hash = "";
  onHash();
  assert.equal(item.hidden, false, "clearing query restores publications");
}
console.log("Publication search regression tests passed.");
