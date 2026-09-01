# Bomb Pot Slot Machine 💣

[See it in action](https://bomb-pot.netlify.app) [![Netlify Status](https://api.netlify.com/api/v1/badges/e70440c6-c477-480c-af02-530139b01c6b/deploy-status)](https://app.netlify.com/projects/bomb-pot/deploys)

This is a mobile-responsive web application designed to be used during a friendly poker game. Once per orbit, a player can tap the "Select Game" button to randomly select a limit bomb pot game. The app features a realistic slot machine rolling animation, complete with synthesized Web Audio ticking and a winning chime.

## Managing Games & Rules

The list of games displayed on the slot machine roller and their associated rules are fully customizable in a single file.

To add, modify, or remove games:
1. Open the `public/games.json` file.
2. Edit or add game entries with their respective deal, rules, and pot split details.
3. Save the file. The slot machine will automatically update its roller and info modal!

*Example `public/games.json`:*
```json
{
  "4 Card Omaha Hi": {
    "name": "4 Card Omaha Hi",
    "deal": "4 hole cards dealt to each player; 1 community board.",
    "rules": "You MUST use exactly 2 cards from your hand and 3 cards from the board.",
    "winner": "Best 5-card standard poker hand scoops the entire pot."
  },
  "Crazy Pineapple Double Board": {
    "name": "Crazy Pineapple Double Board",
    "deal": "3 hole cards dealt to each player; 2 separate community boards.",
    "rules": "After post-flop betting (before the turn), all active players MUST discard 1 hole card, keeping 2. Standard Hold'em rules apply.",
    "winner": "Pot splits 50/50 between Board 1 and Board 2 high hands."
  }
}
```

## How to Publish to Netlify

This project was built using React and Vite, making it incredibly easy to deploy as a fast, static site on Netlify.

### Option 1: Drag and Drop (Easiest)
1. Run `npm run build` in your terminal. This will create a `dist` folder containing the optimized, production-ready app.
2. Log into your [Netlify](https://app.netlify.com/) account.
3. Go to the **Sites** tab and simply drag-and-drop the entire `dist` folder into the deployment area.
4. Your site will instantly go live!

### Option 2: Continuous Deployment via GitHub
1. Push this code repository to your GitHub account.
2. In the Netlify dashboard, click **Add new site** -> **Import an existing project**.
3. Select your GitHub repository.
4. Netlify will automatically detect the Vite build settings (Build command: `npm run build`, Publish directory: `dist`).
5. Click **Deploy site**. Netlify will now automatically rebuild and redeploy your app every time you push new code to the repository!

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. All rights reserved Traveling Tech Guy LLC.
