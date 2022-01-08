import os from 'os';
import { join, resolve } from 'path';
import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import './samples/electron-store';

// https://github.com/electron/remote/blob/main/README.md
import * as electronRemoteMain from '@electron/remote/main';
// import electronRemoteMain = require('@electron/remote/main')
electronRemoteMain.initialize();
// require('@electron/remote/main').initialize()
// console.log("src/main process ",process.type)

const isWin7 = os.release().startsWith('6.1');
if (isWin7) app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

async function mainWin() {
  win = new BrowserWindow({
    title: 'Main window',
    minWidth: 850,
    minHeight: 750,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  } else {
    const pkg = await import('../../package.json');
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`;

    win.loadURL(url);
    // win.maximize()
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });
  // https://github.com/electron/remote/blob/main/README.md
  electronRemoteMain.enable(win.webContents);

  // 获取黑夜白天状态
  ipcMain.handle('dark-mode:getThemeSource', () => {
    return nativeTheme.themeSource;
  });
  // 处理暗夜模式
  ipcMain.handle('dark-mode:toggle', () => {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
    return nativeTheme.shouldUseDarkColors;
  });
  // 跟随系统 TODO 需要储存某值，下次打开是自动变更
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });
}

app.whenReady().then(mainWin);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
app.on('second-instance', () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
// 处理 url 协议
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('jm', process.execPath, [resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('jm');
}
// 处理协议 在本例中，我们选择显示一个错误提示对话框。
app.on('open-url', (event, url) => {
  console.log(decodeURIComponent(url));
});
