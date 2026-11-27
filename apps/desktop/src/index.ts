/**
 * The desktop wrapper is a later decision: Electron, Tauri or a platform webview are all
 * still on the table, so this workspace stays a documented stub. It refuses to pretend
 * a package exists instead of producing one nobody has chosen the shape of.
 */
export class DesktopPackagingUnavailableError extends Error {
  constructor() {
    super('the desktop wrapper is not decided yet; packaging is unavailable (see README)');
    this.name = 'DesktopPackagingUnavailableError';
  }
}

export function packageDesktop(): never {
  throw new DesktopPackagingUnavailableError();
}
