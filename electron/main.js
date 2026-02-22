const { app, BrowserWindow, Menu, shell } = require('electron');
const express = require('express');
const path = require('path');
const http = require('http');

// ── Embedded HTTP server so Puter.js gets a valid http:// origin ──────────
const PORT = 4200;
let serverStarted = false;

function startServer() {
  return new Promise((resolve) => {
    if (serverStarted) return resolve();
    const expressApp = express();
    expressApp.use(express.static(path.join(__dirname, '..')));
    const server = http.createServer(expressApp);
    server.listen(PORT, '127.0.0.1', () => {
      serverStarted = true;
      resolve();
    });
  });
}

// ── App window ────────────────────────────────────────────────────────────
let mainWindow;

async function createWindow() {
  await startServer();

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 780,
    minWidth: 480,
    minHeight: 600,
    title: 'Sajid AI',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#0a0c14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Allow Puter.js popup auth to work correctly
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    autoHideMenuBar: true,
    show: false,
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // ── Window open handler — critical for Puter.js auth ─────────────────
  // Puter.js opens a popup (puter.com) to authenticate the user.
  // We MUST allow those to open as native Electron windows so that
  // window.opener and postMessage work. Anything else goes to the browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const isPuterAuth =
      url.includes('puter.com') ||
      url.includes('api.puter.com') ||
      url.includes('embedded_in_popup') ||
      url.includes('request_auth');

    if (isPuterAuth) {
      // Allow as a child BrowserWindow — keeps window.opener intact
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 500,
          height: 660,
          title: 'Sign in to Sajid AI',
          backgroundColor: '#0a0c14',
          autoHideMenuBar: true,
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
          },
        },
      };
    }

    // All other external links → open in default browser
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── App menu ──────────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'Sajid AI',
      submenu: [
        { label: 'About Sajid AI', click: () => shell.openExternal('https://sajidkhan.me') },
        { type: 'separator' },
        { role: 'quit', label: 'Quit Sajid AI' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools', label: 'Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Visit sajidkhan.me', click: () => shell.openExternal('https://sajidkhan.me') },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── Electron lifecycle ────────────────────────────────────────────────────
app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
