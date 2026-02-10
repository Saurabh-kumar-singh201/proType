# ProType - Project Structure

```
protype/
│
├── frontend/                  # Static client app (served separately)
│   ├── index.html             # Main entry point
│   ├── css/                   # Stylesheets
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── js/                    # Client modules
│   │   ├── app.js
│   │   ├── GameState.js
│   │   ├── Multiplayer.js
│   │   ├── TextGenerator.js
│   │   ├── UI.js
│   │   └── config.js
│   └── package.json           # Frontend dev script (serve)
│
├── backend/                   # Multiplayer backend (Socket.IO)
│   ├── server.js              # Express + Socket.IO server
│   ├── package.json           # Backend dependencies
│   └── package-lock.json
│
├── README.md                  # Project documentation
└── .gitignore                 # Git ignore rules
```

## Notes
- `frontend` is static and can be deployed to Vercel/Netlify.
- `backend` is a Node server and should be deployed separately.
