# Jammming

A web application that allows users to search for songs using the Spotify API and create custom playlists that can be exported to their Spotify account.

## Features

- 🔍 Search for songs by title, artist, or album
- 📱 Responsive design that works on desktop and mobile
- 🎵 Preview song samples
- ⭐ Create and manage custom playlists
- 💾 Export playlists directly to Spotify
- 🔐 Secure authentication with Spotify

## Technologies Used

- **Frontend:**
  - React 18
  - React Router for navigation
  - Tailwind CSS for styling
  - Shadcn/ui for UI components
  - Lucide React for icons

- **Authentication & API:**
  - Spotify Web API
  - OAuth 2.0 authentication flow

- **Development & Deployment:**
  - Vite for build tooling
  - Git for version control
  - GitHub for repository hosting
  - Vercel for deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Spotify Developer account
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jammming.git
   cd jammming
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Spotify API credentials:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
spotify-playlist-creator/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API and authentication services
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## Future Enhancements

- [ ] Add support for creating multiple playlists
- [ ] Implement collaborative playlist features
- [ ] Add music recommendations based on selected songs
- [ ] Include drag-and-drop functionality for playlist management
- [ ] Add playlist sharing capabilities
- [ ] Implement advanced search filters (genre, popularity, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Spotify Web API Documentation
- React Documentation
- Shadcn/ui Component Library