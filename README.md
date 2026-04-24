# Curious-Ghosts

Curious Ghosts — a small interactive canvas demo built with HTML, CSS and JavaScript. Move your mouse (or touch on mobile) and watch playful ghost eyes follow your pointer across the screen.

---

## Demo

![Curious Ghosts Screenshot](https://github.com/BinaryVortex/Curious-Ghosts/blob/main/Screenshot%202024-05-17%20233808.png)

---

## Features

- Hand-drawn ghost bodies with moving eyes driven by canvas 2D.
- Real-time interaction: ghosts' eyes follow your mouse or touch input.
- Responsive — the number of ghosts adapts to the viewport size.
- Lightweight: implemented in plain JavaScript without external libraries.

## How to run

1. Clone the repository:

   git clone https://github.com/BinaryVortex/Curious-Ghosts.git

2. Open the demo locally:

   - Double-click `index.html` to open it in your browser, or
   - Serve the folder over a local HTTP server (recommended for some browsers):

     ```bash
     # Python 3
     python -m http.server 8000
     # then visit http://localhost:8000
     ```

3. Move your mouse or touch the screen to see the ghosts follow your pointer.

## Controls

- Mouse: move the pointer — the eyes follow.
- Touch (mobile/tablet): drag your finger to interact.

## Files

- `index.html` — minimal HTML that includes the canvas and links to CSS/JS.
- `style.css` — simple stylesheet for the page.
- `script.js` — main JavaScript containing Application, Ghost, Eye, and Vector2D classes.
- `Screenshot 2024-05-17 233808.png` — example screenshot used above.

## Notes for contributors

- The code is small and well-commented — a good entry point for experimenting with canvas animations.
- If you'd like to add features, consider:
  - Adding colors or ghost skins.
  - Adding a settings panel to control ghost count, size, or speed.
  - Exporting the animation as a GIF or recording.

## License

No license specified. If you'd like this project to be open-source under a particular license (MIT, Apache-2.0, etc.), add a `LICENSE` file to the repository.
