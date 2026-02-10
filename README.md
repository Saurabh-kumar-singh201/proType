# ProType

A professional, feature-rich typing speed test application with a beautiful Monokai Pro dark theme.

![ProType](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Test Modes
- **Time Mode**: Test your typing speed within a time limit (15s, 30s, 60s, 120s)
- **Words Mode**: Type a specific number of words (10, 25, 50, 100)
- **Quote Mode**: Practice with inspirational quotes

### Difficulty Levels
- **Easy**: Common, frequently used words
- **Medium**: Everyday vocabulary
- **Hard**: Complex and longer words

### Advanced Options
- **Punctuation**: Adds realistic punctuation marks (`,` `.` `!` `?` `;` `:`)
- **Numbers**: Includes random numbers in the text
- **Smart Capitalization**: Automatically capitalizes appropriately

### Real-time Statistics
- **WPM (Words Per Minute)**: Live calculation of typing speed
- **Accuracy**: Percentage of correct characters
- **Character Count**: Number of correct characters typed
- **Visual Progress Bar**: Track your progress through the test

### UI/UX Features
- Monokai Pro dark theme (authentic VSCode colors)
- Smooth animations and transitions
- Responsive design (works on all devices)
- Keyboard shortcuts (Tab/Esc to restart)
- Professional results modal

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, animations, and grid/flexbox layouts
- **Vanilla JavaScript (ES6+)**: Modular architecture with classes
  - ES6 Modules
  - Object-oriented design
  - Separation of concerns

## 📁 Project Structure

```
protype/
├── index.html              # Main HTML file
├── css/
│   ├── variables.css       # CSS custom properties (Monokai Pro theme)
│   ├── base.css           # Base styles and layout
│   ├── components.css     # Component-specific styles
│   └── animations.css     # Keyframe animations
├── js/
│   ├── app.js             # Main application controller
│   ├── GameState.js       # Game state management class
│   ├── TextGenerator.js   # Text generation logic
│   ├── UI.js              # DOM manipulation and UI updates
│   └── config.js          # Configuration and constants
└── README.md              # Project documentation
```

## 🎨 Design Philosophy

ProType uses the authentic **Monokai Pro** color scheme from VSCode:

- **Background**: `#272822` (Classic Monokai editor background)
- **Foreground**: `#f8f8f2` (Bright cream white text)
- **Accents**: 
  - Cyan: `#66d9ef`
  - Purple: `#ae81ff`
  - Green: `#a6e22e`
  - Pink: `#f92672`
  - Yellow: `#e2e22e`

The design prioritizes:
- **Readability**: Large, monospaced font for typing
- **Focus**: Minimal distractions, clean interface
- **Feedback**: Real-time visual feedback for correct/incorrect characters
- **Professionalism**: Polished animations and smooth interactions

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser

That's it! No build process, no dependencies, no installation required.

### Usage

1. **Select your preferences**:
   - Choose a mode (Time/Words/Quote)
   - Set difficulty level
   - Toggle punctuation and numbers if desired

2. **Start typing**:
   - The test begins automatically when you start typing
   - Focus on accuracy first, speed will follow

3. **Track your progress**:
   - Watch your WPM increase in real-time
   - Monitor your accuracy percentage
   - See the progress bar fill up

4. **Review results**:
   - View detailed statistics when complete
   - Try again to beat your score

### Keyboard Shortcuts

- **Tab** or **Esc**: Restart the current test
- **Any key**: Start the test (first keypress)

## 🎯 WPM Calculation

WPM is calculated using the standard formula:
```
WPM = (Correct Characters / 5) / (Time in Minutes)
```

Where a "word" is defined as 5 characters (industry standard).

## 🏗️ Architecture

### Modular Design

ProType follows a **class-based, modular architecture**:

1. **GameState**: Manages all game state and logic
   - Tracks current progress
   - Calculates statistics
   - Manages timers

2. **TextGenerator**: Handles text generation
   - Word randomization
   - Punctuation insertion
   - Number generation
   - Capitalization logic

3. **UI**: Controls all DOM interactions
   - Updates display elements
   - Renders text with proper highlighting
   - Shows/hides modals
   - Manages visual state

4. **ProTypeApp**: Main controller
   - Coordinates between modules
   - Handles user input
   - Manages application flow

### Benefits of This Architecture

- **Maintainability**: Each module has a single responsibility
- **Testability**: Classes can be unit tested independently
- **Scalability**: Easy to add new features
- **Readability**: Clear separation of concerns

## 🔮 Future Enhancements

Potential features for future versions:

- [ ] Theme customization (multiple color schemes)
- [ ] User accounts and progress tracking
- [ ] Leaderboards
- [ ] Custom text upload
- [ ] Programming language mode (code snippets)
- [ ] Multiplayer race mode
- [ ] Advanced statistics and graphs
- [ ] Sound effects (toggle-able)
- [ ] Practice mode with specific weak characters

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Monokai Pro** theme by Wimer Hazenberg
- **JetBrains Mono** font by JetBrains
- **Syne** font by Bonjour Monde
- Inspired by Monkeytype

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Happy Typing! 🎉**
