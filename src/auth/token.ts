import fs from 'fs';
import os from 'os';
import path from 'path';

const configDir = path.join(os.homedir(), '.octoreport');
const tokenPath = path.join(configDir, 'token.json');

export function setToken(token: string) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify({ accessToken: token }), 'utf-8');
}

export function getToken(): string | null {
  if (!fs.existsSync(tokenPath)) return null;
  const { accessToken } = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  return accessToken;
}
