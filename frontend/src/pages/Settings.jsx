import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Eye, Moon, Check } from "lucide-react";

export default function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [appNotif, setAppNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(false);

  const [toastMsg, setToastMsg] = useState("");

  const handleSave = () => {
    setToastMsg("Settings configurations saved successfully!");
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <div className="min-h-screen bg-bg-light pt-28 pb-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-[700px] mx-auto space-y-6 animate-fade-in relative">
        
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-[999] bg-[#121e1b] text-white border border-[#334155] py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </div>
        )}

        {/* Header Title */}
        <div className="border-b border-border-color pb-4">
          <h1 className="text-3xl font-serif font-extrabold text-text-dark">Settings</h1>
          <p className="text-sm text-text-gray mt-1 font-medium">Manage your security passwords, notification toggles, and UI variables.</p>
        </div>

        {/* Settings Box 1: Notifications */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-text-dark flex items-center gap-2 border-b border-border-color pb-3">
            <Bell className="w-4 h-4 text-primary" /> Notifications Configuration
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-text-dark">Email Notification updates</h4>
                <p className="text-[10.5px] text-text-gray mt-0.5">Receive receipts and dynamic tickets in your inbox.</p>
              </div>
              <input 
                type="checkbox" 
                checked={emailNotif} 
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="w-8.5 h-4.5 accent-primary cursor-pointer" 
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-text-dark">App Push alerts</h4>
                <p className="text-[10.5px] text-text-gray mt-0.5">Receive HMR updates and active support notifications.</p>
              </div>
              <input 
                type="checkbox" 
                checked={appNotif} 
                onChange={(e) => setAppNotif(e.target.checked)}
                className="w-8.5 h-4.5 accent-primary cursor-pointer" 
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-text-dark">SMS Transit alerts</h4>
                <p className="text-[10.5px] text-text-gray mt-0.5">Receive cab transfer coordinates on your mobile number.</p>
              </div>
              <input 
                type="checkbox" 
                checked={smsNotif} 
                onChange={(e) => setSmsNotif(e.target.checked)}
                className="w-8.5 h-4.5 accent-primary cursor-pointer" 
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-text-dark">Promotional & offers newsletter</h4>
                <p className="text-[10.5px] text-text-gray mt-0.5">Receive marketing deals for upcoming vacations.</p>
              </div>
              <input 
                type="checkbox" 
                checked={marketingNotif} 
                onChange={(e) => setMarketingNotif(e.target.checked)}
                className="w-8.5 h-4.5 accent-primary cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Settings Box 2: Password & Security */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-text-dark flex items-center gap-2 border-b border-border-color pb-3">
            <Shield className="w-4 h-4 text-amber-500" /> Password & Security
          </h3>

          <div className="space-y-4 text-[12px] font-semibold text-text-dark">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-text-gray uppercase font-bold">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="p-3 border border-border-color bg-bg-light text-text-dark text-sm rounded-lg outline-none focus:border-primary transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-text-gray uppercase font-bold">New Security Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="p-3 border border-border-color bg-bg-light text-text-dark text-sm rounded-lg outline-none focus:border-primary transition"
              />
            </div>
          </div>
        </div>

        {/* Settings Box 3: Connected Accounts */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-text-dark flex items-center gap-2 border-b border-border-color pb-3">
            <Shield className="w-4 h-4 text-emerald-500" /> Connected Social Accounts
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 object-contain" />
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Google Connection</h4>
                  <p className="text-[10px] text-text-gray mt-0.5">Connected as user@gmail.com</p>
                </div>
              </div>
              <button 
                onClick={() => setToastMsg("Google account unlinked.")}
                className="px-4 py-1.5 border border-red-200 text-red-500 rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-red-50 transition border-none"
              >
                Disconnect
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="https://www.svgrepo.com/show/511330/apple-black.svg" alt="Apple" className="w-5 h-5 object-contain" />
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Apple Connection</h4>
                  <p className="text-[10px] text-text-gray mt-0.5">Securely linked via Apple ID</p>
                </div>
              </div>
              <button 
                onClick={() => setToastMsg("Apple account connection initiated...")}
                className="px-4 py-1.5 border border-border-color text-text-dark rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-bg-light transition border-none"
              >
                Connect
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="https://www.svgrepo.com/show/475633/microsoft-color.svg" alt="Microsoft" className="w-5 h-5 object-contain" />
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Microsoft Connection</h4>
                  <p className="text-[10px] text-text-gray mt-0.5">Link corporate or outlook logins</p>
                </div>
              </div>
              <button 
                onClick={() => setToastMsg("Microsoft account connection initiated...")}
                className="px-4 py-1.5 border border-border-color text-text-dark rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-bg-light transition border-none"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow border-none cursor-pointer text-center"
        >
          Save Configurations
        </button>

      </div>
    </div>
  );
}
