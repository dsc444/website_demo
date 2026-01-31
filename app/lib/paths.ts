import path from 'path';

export const DATA_DIR = path.join(process.cwd(), 'data');
export const DB_PATH = path.join(DATA_DIR, 'db.json');
export const COOKIE_FILE = path.join(DATA_DIR, 'cookies.json');
export const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
export const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');