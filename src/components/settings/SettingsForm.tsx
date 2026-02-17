import { useState } from "react";
import { Key, Link, Bell, Save, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ApiSettings {
  geminiApiKey: string;
  xApiKey: string;
  xApiSecret: string;
  xAccessToken: string;
  xAccessTokenSecret: string;
  notifications: boolean;
  autoPost: boolean;
}

const SETTINGS_KEY = "xpost_api_settings";
const ENCRYPTION_KEY = "xpost_enc_v1";

// AES-256 compatible encryption using Web Crypto API
async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  return keyMaterial;
}

async function encryptData(data: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
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

const DEFAULT_SETTINGS: ApiSettings = {
  geminiApiKey: "",
  xApiKey: "",
  xApiSecret: "",
  xAccessToken: "",
  xAccessTokenSecret: "",
  notifications: true,
  autoPost: false,
};

export function SettingsForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<ApiSettings>(DEFAULT_SETTINGS);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Load and decrypt settings on mount
  useState(() => {
    (async () => {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const decrypted = await decryptData(saved);
          if (decrypted) {
            setSettings(JSON.parse(decrypted));
          }
        }
      } catch {}
      setLoaded(true);
    })();
  });

  const toggleShow = (key: string) =>
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setIsSaving(true);
    const encrypted = await encryptData(JSON.stringify(settings));
    localStorage.setItem(SETTINGS_KEY, encrypted);
    setIsSaving(false);
    toast.success("Settings encrypted & saved with AES-256!");
  };

  const renderKeyInput = (
    label: string,
    field: keyof ApiSettings,
    placeholder: string
  ) => (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-2 block">
        {label}
      </label>
      <div className="relative">
        <Input
          type={showKeys[field] ? "text" : "password"}
          placeholder={placeholder}
          value={settings[field] as string}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          className="bg-secondary/50 border-border pr-10"
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showKeys[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Encryption Notice */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
        <div>
          <p className="font-semibold text-foreground">AES-256 Encrypted Storage</p>
          <p className="text-sm text-muted-foreground">
            All API keys and secrets are encrypted using AES-256-GCM before being stored locally. Your credentials are never saved in plain text.
          </p>
        </div>
      </div>

      {/* Gemini API Key */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gemini AI</h3>
            <p className="text-sm text-muted-foreground">Configure your Google Gemini API key</p>
          </div>
        </div>
        <div className="space-y-4">
          {renderKeyInput("Gemini API Key", "geminiApiKey", "AIza...")}
          <p className="text-xs text-muted-foreground">
            Get your key from{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>
      </div>

      {/* X/Twitter API Keys */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Link className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">X (Twitter) API</h3>
            <p className="text-sm text-muted-foreground">Enter your X Developer API credentials</p>
          </div>
        </div>
        <div className="space-y-4">
          {renderKeyInput("API Key", "xApiKey", "Your X API Key")}
          {renderKeyInput("API Secret", "xApiSecret", "Your X API Secret")}
          {renderKeyInput("Access Token", "xAccessToken", "Your X Access Token")}
          {renderKeyInput("Access Token Secret", "xAccessTokenSecret", "Your X Access Token Secret")}
          <p className="text-xs text-muted-foreground">
            Get your credentials from the{" "}
            <a
              href="https://developer.x.com/en/portal/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              X Developer Portal
            </a>
          </p>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
            <div>
              <p className="font-medium text-foreground">Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about post performance</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
            <div>
              <p className="font-medium text-foreground">Auto-post scheduled content</p>
              <p className="text-sm text-muted-foreground">Automatically publish at scheduled times</p>
            </div>
            <Switch
              checked={settings.autoPost}
              onCheckedChange={(checked) => setSettings({ ...settings, autoPost: checked })}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="glow" size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}