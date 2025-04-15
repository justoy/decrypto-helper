# Decrypto Helper

Decrypto Helper is a lightweight web application that simplifies playing the board game [Decrypto](https://boardgamegeek.com/boardgame/225694/decrypto) with an AI-powered teammate.

Enjoy the game with **just two players** by pairing each human with an AI partner!

You can use it online at [https://decrypto-helper.vercel.app](https://decrypto-helper.vercel.app) or deploy it locally.

## Features

- **Secret Words Generation:** Creates four random secret words using a local JavaScript library.
- **Hidden Code Generation:** Shuffles the numbers [1, 2, 3, 4] and selects the first three to form a 3-digit code.
- **AI Guessing:** Provide hints and see how the AI teammate would guess the code.
- **Interactive Tracking:** Use a dynamic tracking sheet that organizes hints by secret-word number, mirroring the physical game sheets.
- **Two-Person Mode:** Pair one human with an AI partner.

## Getting Started

1. Open [Decrypto Helper](https://decrypto-helper.vercel.app) either online or through your local deployment.
2. (Optional) Enter your OpenAI API key if you want to use the AI guessing feature. This enables gameplay for teams even if only two players are participating, with one human and one AI partner per team.
3. Click **Generate 4 Words** to display your team’s secret words.
4. Click **Generate 3 Random Numbers** to create a hidden code for the current turn.
5. Provide hints (verbally or in writing) to your opponent, just as in the physical game.
6. Type your hints into the “Enter 3 hints” field and click “Ask AI to guess my code” to see the AI’s guess.
7. Use the interactive **Decrypto Tracking Sheet** to log and view hints and codes across rounds.
8. Continue playing by repeating the process or passing the device to the next player.

## Local Deployment

To run Decrypto Helper locally, follow these steps:

1. **Clone or Download** this repository.
2. **Install Dependencies:**  
   Run `npm install` or `yarn install` in your terminal.
3. **Start the Development Server:**  
   Run `npm run dev` or `yarn dev`.
4. Open your browser and navigate to http://localhost:3000.
