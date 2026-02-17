// Shared settings utilities for reading encrypted API keys from localStorage

const SETTINGS_KEY = "xpost_api_settings";
const ENCRYPTION_KEY = "xpost_enc_v1";

export interface ApiSettings {
  geminiApiKey: string;
  xApiKey: string;
  xApiSecret: string;
  xAccessToken: string;
  xAccessTokenSecret: string;
  notifications: boolean;
  autoPost: boolean;
}

async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

async function decryptData(encryptedStr: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const combined = Uint8Array.from(atob(encryptedStr), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return "";
  }
}

export async function loadApiSettings(): Promise<ApiSettings | null> {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return null;
    const decrypted = await decryptData(saved);
    if (!decrypted) return null;
    return JSON.parse(decrypted) as ApiSettings;
  } catch {
    return null;
  }
}
