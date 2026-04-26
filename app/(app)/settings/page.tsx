const settings = ["Autoplay", "Continue Watching visibility", "Default subtitle language", "Glass theme"];

export default function SettingsPage() {
  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="mt-6 grid gap-3">
        {settings.map((setting) => (
          <label key={setting} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <span>{setting}</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-violet-400" />
          </label>
        ))}
      </div>
    </section>
  );
}
