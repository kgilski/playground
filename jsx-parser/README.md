# jsx-parser

## Goal

The goal is to create a parser that replaces JSX elements in a file with JavaScript functions.

```jsx
// Inupt
export function Component() {
    let myRef = null;
    let name = "Fernando";
    let myClass = "open";
    return (
        <div className={myClass} ref={myRef}>
            <h1>Hello {name}!</h1>
        </div>
    );
}

// Output
export function Component() {
    let myRef = null;
    let name = "Fernando";
    let myClass = "open";
    return MyLib.createElement(
        "div",
        { className: myClass, ref: myRef },
        MyLib.createElement("h1", {}, "Hello " + name + "!")
    );
}
```

`MyLib` is a minimalistic implementation of a library that provides `createElement` function that can return HTML.

## Limitations

- Regular expression for finding JSX elements can find only one block per file.
- Does not support any JavaScript (conditions, loops) inside the JSX.


## Resources

_[Demystifying JSX: Understanding How it Works Behind the Scenes - Elyas Hanafi](https://medium.com/@elyashanafilts/demystifying-jsx-understanding-how-it-works-behind-the-scenes-d89fdb2db640)_

_[Demystifying JSX: building your own JSX parser from scratch - Fernando Doglio](https://blog.bitsrc.io/demystifying-jsx-building-your-own-jsx-parser-from-scratch-caecf58d7cbd)_

_[GitHub: deleteman/jsx-parser](https://github.com/deleteman/jsx-parser/tree/main)_
