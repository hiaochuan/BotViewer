# Fusion Alpha Manager - Electron Desktop Application

A modern, feature-rich desktop application for managing the Fusion Alpha Trading Bot system. Built with Electron, React, TypeScript, and Tailwind CSS.

## 🎯 Features

### User Management
- ✅ Add/remove trading bot users
- ✅ Configure Gate.io API credentials
- ✅ Toggle between REAL and SIMULATED trading modes
- ✅ Start/stop individual users
- ✅ Balance monitoring with configurable thresholds
- ✅ Close all positions with one click
- ✅ Export functionality

### KOL Management
- ✅ Add/remove Key Opinion Leaders
- ✅ Support for NORMAL and WWG KOL types
- ✅ Configure Discord channel monitoring
- ✅ Filter by specific Discord author IDs
- ✅ Visual status indicators

### Track Configuration
- ✅ Link users to KOLs for automated trading
- ✅ Multiple amount modes:
  - **Loss Fixed**: Set maximum loss threshold
  - **Fixed**: Specify exact amounts per symbol
  - **Percentage**: Use percentage-based amounts
- ✅ Reverse trading option
- ✅ Future symbols filtering
- ✅ Start/stop/restart track control
- ✅ Real-time status monitoring

### Dashboard & Monitoring
- ✅ Overview statistics
- ✅ Real-time data updates (configurable interval)
- ✅ Quick action buttons
- ✅ Activity logging

### Modern UI/UX
- 🎨 Dark mode optimized interface
- 🚀 Smooth animations and transitions
- 📱 Responsive design
- 💾 Persistent settings
- ⚡ Fast and lightweight

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Fusion Alpha API server running (default: http://127.0.0.1:8888)

### Installation

```bash
# Navigate to BotViewer directory
cd BotViewer

# Install dependencies
npm install

# Start in development mode
npm run dev
```

The application will open automatically with:
- React dev server on http://localhost:5173
- Electron window with live reload

### Building for Production

```bash
# Build the application
npm run build

# Or use the build script
chmod +x build.sh
./build.sh

# Package for distribution
npm run build:electron
```

Built applications will be in the `release/` directory.

## 📁 Project Structure

```
BotViewer/
├── electron/              # Electron main process
│   ├── main.ts           # Main process entry
│   ├── preload.ts        # Preload script
│   └── tsconfig.json     # TypeScript config for Electron
├── src/                   # React application
│   ├── components/       # React components
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── KOLManagement.tsx
│   │   ├── TrackManagement.tsx
│   │   └── SettingsPanel.tsx
│   ├── services/         # API services
│   │   └── api.ts        # API client
│   ├── store/            # State management
│   │   └── settings.ts   # Settings store (Zustand)
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Technology Stack

- **Electron**: Desktop application framework
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Data fetching and caching
- **Zustand**: Lightweight state management
- **Axios**: HTTP client
- **Lucide React**: Beautiful icon library

## ⚙️ Configuration

Configure the application in the **Settings** tab:

- **API Base URL**: Set your Fusion Alpha API server URL
- **Refresh Interval**: Control how often data is refreshed (minimum 1000ms)

Settings are automatically persisted to local storage.

## 🔧 API Integration

The application communicates with the Fusion Alpha API server. All API endpoints from the original `client.py` are implemented:

### User Endpoints
- `POST /user/add` - Add new user
- `GET /user/get` - Get users
- `POST /user/update` - Update user
- `DELETE /user/remove` - Remove user
- `POST /user/run` - Start user
- `POST /user/stop` - Stop user
- `POST /user/monitor/run` - Start balance monitor
- `POST /user/monitor/stop` - Stop balance monitor
- `POST /user/close_all` - Close all positions
- `POST /user/exporter/start` - Start exporter
- `POST /user/exporter/stop` - Stop exporter

### KOL Endpoints
- `POST /kol/add` - Add new KOL
- `GET /kol/get` - Get KOLs
- `DELETE /kol/remove` - Remove KOL

### Track Endpoints
- `POST /kol/track/add` - Add track config
- `GET /kol/track/get` - Get track configs
- `DELETE /kol/track/remove` - Remove track config
- `POST /kol/track/start` - Start tracking
- `POST /kol/track/stop` - Stop tracking
- `POST /kol/track/restart` - Restart tracking

## 🎯 Usage Examples

### Adding a User

1. Click "Add User" in the Users tab
2. Fill in:
   - Username
   - Gate.io API Key
   - Gate.io Secret Key
   - Trade Mode (REAL/SIMULATED)
3. Optionally enable balance monitoring with thresholds
4. Click "Add User"

### Creating a Track Configuration

1. Ensure you have at least one User and one KOL created
2. Go to the Tracks tab
3. Click "Add Track Config"
4. Select user and KOL
5. Choose amount mode and configure parameters
6. Optionally add specific futures to track
7. Enable reverse trading if needed
8. Click "Add Track Config"
9. Start the track with the "Start" button

## 🐛 Troubleshooting

### Application won't connect to API

- Verify API server is running
- Check the API Base URL in Settings
- Ensure no firewall is blocking the connection

### Data not refreshing

- Check refresh interval in Settings
- Verify API server is responding
- Check browser console for errors

### Build errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18+

## 📝 Development

### Adding New Features

1. Create types in `src/types/index.ts`
2. Add API methods in `src/services/api.ts`
3. Create/update components in `src/components/`
4. Use TanStack Query for data fetching
5. Follow existing patterns for consistency

### Code Style

- Use TypeScript strict mode
- Follow React best practices
- Use Tailwind utility classes
- Keep components focused and reusable
- Add proper error handling

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API server logs

## 🎉 Acknowledgments

Built as a modern replacement for the Python CLI client with enhanced visualization and user experience.

---

**Fusion Alpha Manager** - Professional trading bot management made easy.
