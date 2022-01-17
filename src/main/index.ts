import os from 'os';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import './ipmain.handler';
// https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
const isWin7 = os.release().startsWith('6.1');
if (isWin7) app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    title: import.meta.env.APP_TITLE || 'JustMe',
    width: 850,
    height: 750,
    minWidth: 850,
    minHeight: 750,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  } else {
    const pkg = await import('../../package.json');
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);
// electron-store
ipcMain.handle('electron-store', (_evnet, methodSign: string, ...args: any) => {
  console.log('methodSign methodSign', methodSign);
});
app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (win) {
    // someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// @TODO
// auto update
/* if (app.isPackaged) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) =>
      // maybe you need to record some log files.
      console.error('Failed check update:', e)
    )
} */
