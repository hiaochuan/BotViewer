# Quick Start Guide

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
cd BotViewer
npm install
```

This will install all required packages including:
- Electron for desktop application
- React & TypeScript for UI
- Tailwind CSS for styling
- TanStack Query for data management
- And more...

### Step 2: Start Development Server

```bash
npm run dev
```

This command will:
1. Start the Vite dev server on http://localhost:5173
2. Compile TypeScript
3. Launch the Electron application automatically

The app supports hot-reload, so changes to your code will refresh automatically!

### Step 3: Configure API Connection

1. Once the app opens, go to the **Settings** tab
2. Set your API Base URL (default: http://127.0.0.1:8888)
3. Click "Save Settings"

## 🎯 First Use Workflow

### 1. Add a User

Navigate to **Users** tab:
- Click "Add User"
- Enter username and Gate.io API credentials
- Choose trade mode (REAL or SIMULATED)
- Configure balance monitoring if needed
- Click "Add User"

### 2. Add a KOL

Navigate to **KOLs** tab:
- Click "Add KOL"
- Enter KOL name
- Set Discord channel ID
- Optionally add specific author IDs to monitor
- Click "Add KOL"

### 3. Create Track Configuration

Navigate to **Tracks** tab:
- Click "Add Track Config"
- Select a user and KOL
- Choose amount mode:
  - **Loss Fixed**: Set max loss (e.g., $10)
  - **Fixed**: Set specific amounts per symbol
  - **Percentage**: Use percentage-based amounts
- Add futures to track (optional)
- Enable reverse trading if needed
- Click "Add Track Config"

### 4. Start Trading

- Click "Start" on the track configuration
- Monitor from the **Dashboard**
- Use "Stop" to pause trading
- Use "Restart" to clear positions and restart

## 📦 Building for Production

### Create Distributable Package

```bash
npm run build
```

This creates optimized production builds in:
- `dist/` - Compiled application
- `release/` - Platform-specific installers

### Platform-Specific Builds

The build automatically creates packages for your current platform:

**macOS**: `.dmg` and `.zip`
**Windows**: `.exe` installer and portable
**Linux**: `.AppImage` and `.deb`

## 🛠️ Development Tips

### Hot Reload

The dev server supports hot module replacement. Changes to React components will update instantly without losing state.

### DevTools

In development mode, Electron DevTools opens automatically. Use it to:
- Debug React components
- Inspect network requests
- Monitor performance
- View console logs

### API Testing

Test your API connection:
1. Open browser to http://localhost:5173
2. Check Network tab in DevTools
3. Verify API responses

### Common Issues

**Port 5173 already in use:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Electron won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
# Clean build artifacts
rm -rf dist
npm run build:vite
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Modify Refresh Interval

In Settings panel, adjust "Refresh Interval" (minimum 1000ms).

### Add Custom Features

1. Create component in `src/components/`
2. Add API method in `src/services/api.ts`
3. Define types in `src/types/index.ts`
4. Use TanStack Query for data fetching

## 📱 Keyboard Shortcuts

- `Cmd/Ctrl + R` - Refresh data
- `Cmd/Ctrl + ,` - Open settings
- `Cmd/Ctrl + Q` - Quit application

## 🔍 Debugging

### Enable Verbose Logging

Set environment variable:
```bash
DEBUG=* npm run dev
```

### Check API Responses

All API calls are logged in DevTools Network tab.

### React DevTools

Install React DevTools extension for better component debugging.

## 📊 Performance

The app is optimized for:
- **Fast startup**: < 2 seconds
- **Low memory**: ~100-150MB
- **Smooth UI**: 60fps animations
- **Efficient polling**: Configurable refresh intervals

## 🆘 Getting Help

- Check the main README.md for full documentation
- Review API server logs for backend issues
- Open browser DevTools for frontend debugging
- Check Network tab for API connection problems

## 🎉 You're Ready!

Your Fusion Alpha Manager is now set up and ready to use. Happy trading! 🚀
