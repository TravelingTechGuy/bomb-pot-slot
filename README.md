# Bomb Pot Slot Machine 💣

[See it in action](https://bomb-pot.netlify.app) [![Netlify Status](https://api.netlify.com/api/v1/badges/e70440c6-c477-480c-af02-530139b01c6b/deploy-status)](https://app.netlify.com/projects/bomb-pot/deploys)

This is a mobile-responsive web application designed to be used during a friendly poker game. Once per orbit, a player can tap the "Select Game" button to randomly select a limit bomb pot game. The app features a realistic slot machine rolling animation, complete with synthesized Web Audio ticking and a winning chime.

## Managing the Games List

The list of games displayed on the slot machine roller is fully customizable and easily accessible.

To add, modify, or remove games:
1. Open the `src/games.json` file.
2. Edit the array of text strings to include your desired games.
3. Save the file. The slot machine will automatically update and randomly select from your new list!

*Example `src/games.json`:*
```json
[
  "4 Card Omaha Hi",
  "4 Card Omaha Hi-Lo",
  "Crazy Pineapple Double Board"
]
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
