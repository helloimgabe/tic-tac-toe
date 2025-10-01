# Tic-Tac-Toe Game (Modular JavaScript)

This project is a browser-based Tic-Tac-Toe game developed to demonstrate modular architecture using advanced JavaScript patterns.

## Architectural Principles

The application strictly adheres to the Separation of Concerns (SoC) principle by isolating functionality into single-instance modules, leveraging Immediately Invoked Function Expressions (IIFEs) to enforce a clean separation of roles:
    
    -Gameboard: Data storage of the 3×3 grid and basic cell modification.	
    -Gamecontroller: Logic control, managing turn order, defining players, and checking win/tie conditions.
    -DisplayController: UI/DOM manipulation, rendering the board, updating status messages, and managing user interaction.	

## Key Skills Demonstrated

The core development focused on mastering modern JavaScript features for robust design:

    -Module Pattern: Used IIFEs to create private scope for variables (e.g., the board array, turnTracker) and expose only necessary public methods.
    -Encapsulation & Closures: Ensured internal state (like the players array) is updated privately by functions like setupPlayers(), preventing global variable leakage.
    -Dynamic Event Handling: Implemented logic to correctly add and remove event listeners using a named function (tileClick) to enable/disable the board controls upon game start/end.
    -Destructuring: Used array destructuring (const [r0, c0] = line[0];) for clean, readable extraction of coordinates during win condition checks.
    -User Flow: Designed a clear Start/Reset flow, ensuring player names are read and game state is initialized only upon user command, not on page load.
