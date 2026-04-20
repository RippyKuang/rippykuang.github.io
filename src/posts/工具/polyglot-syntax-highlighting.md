---
title: "Polyglot Programming: Syntax Highlighting Demo"
date: "2026-04-18"
excerpt: "A quick demonstration of how beautiful our minimalist syntax highlighter looks across different programming languages including TS, Rust, Go, and CSS."
---
# Polyglot Programming: Syntax Highlighting Demo

A quick demonstration of how beautiful our minimalist syntax highlighter looks across different programming languages.

## TypeScript / React

```tsx
import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Click me
    </button>
  );
}
```

## Rust

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert("hello", "world");
    
    match map.get("hello") {
        Some(v) => println!("Found: {}", v),
        None => println!("Not found"),
    }
}
```

## Go

```go
package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Println("worker", id, "started  job", j)
        time.Sleep(time.Second)
        fmt.Println("worker", id, "finished job", j)
        results <- j * 2
    }
}
```

## CSS

```css
.aesthetic-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  background-color: #FCFCFA;
  transition: all 0.3s ease;
}

.aesthetic-container:hover {
  transform: translateY(-2px);
}
```
