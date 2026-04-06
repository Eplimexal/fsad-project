# Installation & Requirements

## System Requirements

### Minimum Requirements
- **Node.js**: v14.0 or higher
- **npm**: v6.0 or higher
- **RAM**: 2GB
- **Disk Space**: 500MB
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Recommended
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **RAM**: 4GB or more
- **OS**: Windows 10+, macOS 10.15+, or modern Linux

## Prerequisites Check

### Windows
```powershell
node --version
npm --version
```

### Mac/Linux
```bash
node --version
npm --version
```

Both should return version numbers.

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd "c:\Users\Asus\Documents\YASWANTH\College\2-2\FSAD--24SDCS02E\project 15"
```

### 2. Install Dependencies
```bash
npm install
```

**Expected Output:**
```
added 188 packages, and audited 189 packages in 25s
```

### 3. Verify Installation
```bash
npm list react react-router-dom
```

## Running the Application

### Development Mode
```bash
npm run dev
```

**Output:**
```
  VITE v7.3.1  ready in 1321 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Project Structure Verification

After installation, verify you have:

```
project 15/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── styles.css
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── LoanContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── admin/
│   │   ├── lender/
│   │   ├── borrower/
│   │   └── analyst/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Dependencies Installed

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x"
}
```

### Development Dependencies
```json
{
  "vite": "^7.3.1",
  "@vitejs/plugin-react": "^4.x",
  "eslint": "^8.x"
}
```

## Troubleshooting Installation

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete package-lock.json
rm package-lock.json

# Reinstall
npm install
```

### Issue: Node/npm not found
**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install with default settings
3. Restart your terminal/PowerShell
4. Verify: `node --version`

### Issue: Port 5173 already in use
**Solution:**
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Issue: EACCES permission errors (Mac/Linux)
**Solution:**
```bash
sudo npm install -g npm
npm install
```

### Issue: Module not found errors
**Solution:**
```bash
# Delete node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## Environment Setup

### Create .env file (for backend integration)
```bash
# In server/ directory
VITE_API_URL=http://localhost:5000/api
```

## Verification Checklist

After installation, verify:

- [ ] `npm --version` works
- [ ] `node --version` works
- [ ] `npm run dev` starts without errors
- [ ] Browser opens at http://localhost:5173/
- [ ] Login page loads
- [ ] Can select a role
- [ ] Can view dashboard after login

## System Compatibility

### Windows
- ✅ Windows 10 or later
- ✅ PowerShell 5.1+
- ✅ Windows Terminal (recommended)

### macOS
- ✅ 10.15 (Catalina) or later
- ✅ Bash or Zsh

### Linux
- ✅ Ubuntu 18.04+
- ✅ Debian 10+
- ✅ Fedora 30+

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Opera | 76+ | ✅ Fully supported |

## Performance Tips

### For Better Development Experience
1. **Use Chrome DevTools**
   - Right-click → Inspect
   - Check Console for errors
   - Use Debugger tab

2. **Install React DevTools**
   - Chrome extension
   - Firefox extension
   - Helps debug components

3. **Keep node_modules clean**
   ```bash
   npm prune
   npm audit fix
   ```

4. **Monitor disk space**
   ```bash
   du -sh node_modules
   ```

## Updating Dependencies

### Check for updates
```bash
npm outdated
```

### Update all packages
```bash
npm update
```

### Update specific package
```bash
npm install package-name@latest
```

## Common npm Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# List installed packages
npm list

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Uninstallation (if needed)

```bash
# Remove node_modules
rm -rf node_modules

# Remove lock files
rm package-lock.json

# Reinstall from scratch
npm install
```

## Getting Help

### Check Node Installation
```bash
where node          # Windows
which node          # Mac/Linux
```

### Check npm Configuration
```bash
npm config list
npm config set registry https://registry.npmjs.org/
```

### Detailed Installation Logs
```bash
npm install --verbose
```

### Check Package Versions
```bash
npm view react version
npm view react-router-dom version
```

## Next Steps After Installation

1. ✅ Verify installation (see checklist above)
2. ✅ Read [QUICKSTART.md](QUICKSTART.md)
3. ✅ Run the application
4. ✅ Explore the dashboards
5. ✅ Read documentation

## Backend Setup (Optional)

To set up a backend server:
1. Create `server/` directory
2. Follow [BACKEND_SETUP.md](BACKEND_SETUP.md)
3. Install Node packages in server folder
4. Configure database
5. Connect frontend to backend

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
1. Push to GitHub
2. Connect to Netlify
3. Select build command: `npm run build`
4. Select output directory: `dist`

## Health Check Commands

```bash
# Check if dev server runs
npm run dev

# Build without errors
npm run build

# No security vulnerabilities
npm audit

# All dependencies installed
npm list
```

## Resources

- **Node.js**: https://nodejs.org/
- **npm Docs**: https://docs.npmjs.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/

---

**Successfully installed?** Run `npm run dev` to start! 🚀
