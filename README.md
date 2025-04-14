# Decrypto Helper

A simple, pure‑frontend tool to help two people play [Decrypto](https://boardgamegeek.com/boardgame/225694/decrypto) using an AI “teammate” in each player’s browser.

## Features

- **Generate 4 secret words**: Uses a local JavaScript library to generate four random words.
- **Generate a 3-digit code (1–4)**: Uses local JavaScript to shuffle `[1,2,3,4]` and pick the first three numbers.
- **Ask the AI to guess**: Once you provide hints, you can see what code the AI would guess.

## How to Use

1. **Clone or Download** this repository.
2. **Install dependencies:** Run `npm install` or `yarn install`.
3. **Enter your OpenAI API key** in the `ApiKeyInput` component.
4. **Run the development server:** Run `npm run dev` or `yarn dev` and open [`http://localhost:3000`](http://localhost:3000) in your browser.
5. **Generate 4 Words** to get your team’s secret words.
6. **Generate 3 Random Numbers** to get the hidden code for your turn.
7. Provide hints verbally or by text to the opposing player (just like in the physical Decrypto).
8. Type your hints in the “Enter 3 hints” field and click “Ask AI to guess my code” to see how well an AI teammate might guess.
9. Repeat for subsequent turns or pass the page to another user.


## License

This project is provided under the [MIT License](LICENSE).

Enjoy playing Decrypto with an AI twist!
