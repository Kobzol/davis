# x86 assembly debugger
This tool allows writing, running and debugging x86 assembly in the browser.<br />
It visualizes the program state (cpu and memory), supports breakpoints and<br />
enables line-by-line stepping.

## Features
* x86 assembly editor
  * Intel/NASM syntax with syntax-highlighting
  * breakpoints
  * current execution line highlight
* CPU emulation
  * run, stop, pause, continue, step execution
  * register and status flags visualization
  * tick rate setting
* Memory visualization
  * variable byte size (1/2/4)
  * ASCII visualization
* Output console

## TODO
* Stack visualizer
* Register dereference visualiser
* Proper arithmetic using 16-bit? calculations
* More instructions
* Enable comments on empty lines

##Installation
Run `npm install`.

## Usage
Opens the site in browser.
```shell
npm start
```

###Tests
```shell
npm test
```

###Build
Builds the application into `dist` folder.
```shell
npm run build
```
