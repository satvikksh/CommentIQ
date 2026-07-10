"use client";

import { useEffect, useState } from "react";
import { Bell, Download, Moon, Save } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { Button } from "@/components/ui/button";

interface SettingsData {
  theme: "dark" | "light";
  notifications: boolean;
  emailNotifications: boolean;
  exportPreferences?: {
    format?: string;
  } | null;
}

interface SettingsResponse {
  success: boolean;
  data?: SettingsData;
  error?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    theme: "dark",
    notifications: true,
    emailNotifications: true,
    exportPreferences: { format: "json" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");
        const data = (await response.json()) as SettingsResponse;

        if (!response.ok || !data.success || !data.data) {
          throw new Error(data.error ?? "Unable to load settings.");
        }

        setSettings(data.data);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await response.json()) as SettingsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to save settings.");
      }

      setMessage("Settings saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-6 lg:p-8">
          <div>
            <h1 className="text-3xl font-black">Settings</h1>
            <p className="mt-2 text-zinc-400">Manage account preferences stored in MongoDB.</p>
          </div>

          {message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-zinc-200">
              {message}
            </div>
          )}

          <section className="grid gap-5 md:grid-cols-3">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  theme: current.theme === "dark" ? "light" : "dark",
                }))
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
            >
              <Moon className="mb-4 h-7 w-7 text-red-400" />
              <h2 className="font-semibold">Theme</h2>
              <p className="mt-2 text-sm text-zinc-400">{settings.theme}</p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  notifications: !current.notifications,
                }))
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
            >
              <Bell className="mb-4 h-7 w-7 text-red-400" />
              <h2 className="font-semibold">Notifications</h2>
              <p className="mt-2 text-sm text-zinc-400">
                {settings.notifications ? "Enabled" : "Disabled"}
              </p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  exportPreferences: {
                    format: current.exportPreferences?.format === "csv" ? "json" : "csv",
                  },
                }))
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
            >
              <Download className="mb-4 h-7 w-7 text-red-400" />
              <h2 className="font-semibold">Default Export</h2>
              <p className="mt-2 text-sm text-zinc-400">
                {settings.exportPreferences?.format ?? "json"}
              </p>
            </button>
          </section>

          <Button onClick={saveSettings} disabled={loading || saving} className="bg-red-600 hover:bg-red-700">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </main>
      </div>
    </div>
  );
}
