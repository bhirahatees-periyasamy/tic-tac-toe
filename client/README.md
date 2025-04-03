# Tic-Tac-Toe (Open Source Template)

## How to Use & Contribute

1. **Fork:** Fork the original repo on GitHub.
2. **Clone or download** your fork to your local machine.
3. **Pick your interest area** to improve:
   - **Frontend**: Modify the `style.css` or the structure in `index.html`.
   - **Backend**: Integrate with a server (Node.js/Python/Java) to store game state or create multiplayer logic.
   - **AI**: In `app.js`, add code for the AI to make a move after each user turn.
   - **UI/UX**: Animate the board, highlight winners, or improve the layout and accessibility.
3. **Create a new feature branch** to make changes to your code. Follow this naming convention to name your branch: `feature/<area>-<improvement>` (*for eg. feature/frontend-react-integration, feature/backend-leaderboards,
feature/ai-minimax, 
feature/ui-confetti*) 
4. **Develop** your changes, then **commit** and **push** to your fork’s branch.
5. **Open a Pull Request** from your branch in your fork to the desired branch in the original repo. **Request to create a remote branch** on the Discord.

---

## Potential Improvements

> *Can you find a scope of improvement in this README.md code already? Open a pull request with the improved README code to perform a demo of the above procedure.*

### Frontend
- Display more game info or instructions.
- Make the layout fully responsive.
- Animate the board or cells (CSS transitions/animations).
- Implement frontend in a Frontend framework like React/Angular/Vue etc.

### Backend
- Persist game state (e.g., store in a database).
- Track leaderboards or user accounts.
- Provide multiplayer over a network or WebSocket.

### AI
- Implement a basic random-move AI if the current player is "O".
- Implement the minimax algorithm to create an unbeatable AI.
- Add difficulty levels or heuristics to give variety.

### UI/UX
- Better feedback on winning (confetti, highlight the winning line).
- Accessibility improvements (screen-reader labels, ARIA roles).
- Customizable themes, language translations, or instructions.

---

## Project Structure
```
tic-tac-toe/
├── index.html
├── style.css
└── app.js
```