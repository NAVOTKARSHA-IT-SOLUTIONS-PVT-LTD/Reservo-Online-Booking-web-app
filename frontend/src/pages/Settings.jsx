import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Bell, Shield, Eye, EyeOff, Moon, Check, Key, Lock } from "lucide-react";
import { authService } from "../services/auth.service";
import { secureStorage } from "../services/secureStorage";
import firebaseService from "../services/firebase.service";
import { apiClient } from "../services/apiClient";

export default function Settings() {
  const navigate = useNavigate();
  const [emailNotif, setEmailNotif] = useState(true);
  const [appNotif, setAppNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(false);

  const [toastMsg, setToastMsg] = useState("");

  // Password update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [firebaseProviders, setFirebaseProviders] = useState({
    google: false,
    facebook: false,
    twitter: false
  });

  // Refresh Firebase provider state from Firebase Auth (source of truth)
  const refreshFirebaseProviders = () => {
    const providers = firebaseService.getConnectedProviders();
    setFirebaseProviders(providers);
  };

  // Refresh providers on mount and after linking/unlinking
  useEffect(() => {
    refreshFirebaseProviders();
  }, []);

  const handleSave = () => {
    setToastMsg("Settings configurations saved successfully!");
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setToastMsg("Please fill in all password fields.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setToastMsg("New password must be at least 6 characters.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMsg("New password and confirmation do not match.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    if (currentPassword === newPassword) {
      setToastMsg("New password must be different from current password.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    try {
      setIsUpdatingPassword(true);

      // Call the direct password update endpoint
      const result = await apiClient.put("/api/v1/user/password", {
        oldPassword: currentPassword,
        newPassword: newPassword
      });

      if (result.success) {
        setToastMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(result.message || "Failed to update password");
      }
    } catch (error) {
      setToastMsg(error.message || "Failed to update password. Please check your current password and try again.");
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setToastMsg(""), 5000);
    }
  };

  const handleSocialConnect = async (provider) => {
    try {
      setConnectingProvider(provider);
      setToastMsg(`Opening ${provider.charAt(0).toUpperCase() + provider.slice(1)} authorization...`);

      // Use the linking flow which should show the authorization screen
      // firebase.service.js expects: 'google', 'facebook', 'twitter'
      const result = await authService.linkAuthProvider(provider);

      if (result.success) {
        setToastMsg(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authorized and connected successfully!`);

        setTimeout(() => setToastMsg(""), 3000);

        // Refresh Firebase providers from source of truth
        refreshFirebaseProviders();
      } else {
        throw new Error(result.message || "Failed to connect account");
      }

    } catch (error) {
      console.error(`${provider} connection error:`, error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      // Handle specific Firebase errors with helpful messages
      // SECURITY: Do NOT auto-link based on email matching
      if (error.code === 'auth/provider-already-linked') {
        setToastMsg(`This ${provider} account is already linked to your account.`);
        setTimeout(() => setToastMsg(""), 3000);
      } else if (error.code === 'auth/credential-already-in-use') {
        // This provider is already linked to another Firebase user
        // DO NOT auto-link based on email - this is a security requirement
        setToastMsg(`This ${provider} account is already linked to another account. Please sign in with ${provider} first, then link it.`);
        setTimeout(() => setToastMsg(""), 5000);
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        // This email exists with a different provider
        // DO NOT auto-link based on email - this is a security requirement
        setToastMsg(`An account with this email already exists with a different sign-in method. Please sign in with your existing method first, then link ${provider}.`);
        setTimeout(() => setToastMsg(""), 5000);
      } else if (error.code === 'auth/popup-closed-by-user') {
        setToastMsg(`The ${provider} authorization popup was closed. Please try again.`);
        setTimeout(() => setToastMsg(""), 3000);
      } else if (error.message?.includes('Unsupported provider')) {
        setToastMsg(`Provider ${provider} is not supported. Please check your Firebase configuration.`);
        setTimeout(() => setToastMsg(""), 5000);
      } else {
        setToastMsg(error.message || `Failed to connect ${provider}. Please try again.`);
        setTimeout(() => setToastMsg(""), 5000);
      }
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleSocialDisconnect = async (provider) => {
    try {
      setConnectingProvider(provider);
      setToastMsg(`Disconnecting ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);

      // Call Firebase to unlink the provider
      const result = await authService.unlinkAuthProvider(provider);

      if (result.success) {
        setToastMsg(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected successfully.`);
        setTimeout(() => setToastMsg(""), 3000);

        // Refresh Firebase providers from source of truth
        refreshFirebaseProviders();
      } else {
        throw new Error(result.message || "Failed to disconnect account");
      }

    } catch (error) {
      console.error(`${provider} disconnection error:`, error);
      setToastMsg(error.message || `Failed to disconnect ${provider}. Please try again.`);
      setTimeout(() => setToastMsg(""), 5000);
    } finally {
      setConnectingProvider(null);
    }
  };

  // Get current user and their connected providers
  const currentUser = authService.getCurrentUser();

  // Check if user is already logged in with any provider
  const isLoggedInWithProvider = currentUser?.provider ||
                                   currentUser?.linkedProviders?.length > 0 ||
                                   currentUser?.providerData?.length > 0;

  // Provider connection status - Firebase Auth is the source of truth
  const isGoogleConnected = firebaseProviders.google;
  const isFacebookConnected = firebaseProviders.facebook;
  const isTwitterConnected = firebaseProviders.twitter;

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "Empty", color: "bg-gray-200" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthMap = {
      0: { label: "Empty", color: "bg-gray-200" },
      1: { label: "Weak", color: "bg-red-400" },
      2: { label: "Fair", color: "bg-orange-400" },
      3: { label: "Good", color: "bg-yellow-400" },
      4: { label: "Strong", color: "bg-green-400" },
      5: { label: "Very Strong", color: "bg-emerald-500" }
    };

    return strengthMap[score] || strengthMap[0];
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
            <Lock className="w-4 h-4 text-amber-500" /> Password & Security
          </h3>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-text-gray uppercase font-bold flex items-center gap-1.5">
                <Key className="w-3 h-3" /> Current Password
              </label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full p-3 pr-10 border border-border-color bg-bg-light text-text-dark text-sm rounded-lg outline-none focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark transition"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-text-gray uppercase font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> New Password
              </label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong new password"
                  className="w-full p-3 pr-10 border border-border-color bg-bg-light text-text-dark text-sm rounded-lg outline-none focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark transition"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrength(newPassword).color}`}
                        style={{ width: `${(getPasswordStrength(newPassword).score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-text-gray">
                      {getPasswordStrength(newPassword).label}
                    </span>
                  </div>
                  <div className="text-[9px] text-text-gray flex flex-wrap gap-2">
                    <span className={newPassword.length >= 6 ? "text-green-500" : ""}>• 6+ characters</span>
                    <span className={/[A-Z]/.test(newPassword) ? "text-green-500" : ""}>• Uppercase</span>
                    <span className={/[0-9]/.test(newPassword) ? "text-green-500" : ""}>• Number</span>
                    <span className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-500" : ""}>• Special char</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-text-gray uppercase font-bold flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Confirm New Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full p-3 pr-10 border border-border-color bg-bg-light text-text-dark text-sm rounded-lg outline-none focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark transition"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow border-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Settings Box 3: Connected Accounts */}
        <div className="bg-bg-white border border-border-color rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-text-dark flex items-center gap-2 border-b border-border-color pb-3">
            <Shield className="w-4 h-4 text-emerald-500" /> Connected Social Accounts
          </h3>

          <div className="space-y-4">
            {/* Google */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-bg-light border border-border-color flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Google Connection</h4>
                  <p className="text-[10px] text-text-gray mt-0.5">
                    {isGoogleConnected ? `Connected as ${currentUser?.email || 'your account'}` : 'Link your Google account for fast single sign-on'}
                  </p>
                </div>
              </div>
              {isGoogleConnected ? (
                <button 
                  type="button"
                  onClick={() => handleSocialDisconnect('google')}
                  disabled={connectingProvider === 'google'}
                  className="px-4 py-1.5 border border-red-200 text-red-500 rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-red-50 transition border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {connectingProvider === 'google' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleSocialConnect('google')}
                  disabled={connectingProvider === 'google'}
                  className="px-4 py-1.5 border border-primary text-primary rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-primary/10 transition border-none flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectingProvider === 'google' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      {isLoggedInWithProvider ? 'Reconnect' : 'Connect'}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Facebook */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-bg-light border border-border-color flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-dark">Facebook Connection</h4>
                  <p className="text-[10px] text-text-gray mt-0.5">
                    {isFacebookConnected ? 'Connected to your Facebook account' : 'Link your Facebook account for fast single sign-on'}
                  </p>
                </div>
              </div>
              {isFacebookConnected ? (
                <button 
                  type="button"
                  onClick={() => handleSocialDisconnect('facebook')}
                  disabled={connectingProvider === 'facebook'}
                  className="px-4 py-1.5 border border-red-200 text-red-500 rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-red-50 transition border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {connectingProvider === 'facebook' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleSocialConnect('facebook')}
                  disabled={connectingProvider === 'facebook'}
                  className="px-4 py-1.5 border border-primary text-primary rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-primary/10 transition border-none flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectingProvider === 'facebook' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      {isLoggedInWithProvider ? 'Reconnect' : 'Connect'}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* X (Twitter) */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-bg-light border border-border-color flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" width="16" height="16" className="text-text-dark fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-dark">X Connection</h4>
                  <p className="text-[10px] text-text-gray mt-0.5">
                    {isTwitterConnected ? 'Connected to your X (Twitter) account' : 'Link your X (Twitter) account'}
                  </p>
                </div>
              </div>
              {isTwitterConnected ? (
                <button 
                  type="button"
                  onClick={() => handleSocialDisconnect('twitter')}
                  disabled={connectingProvider === 'twitter'}
                  className="px-4 py-1.5 border border-red-200 text-red-500 rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-red-50 transition border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {connectingProvider === 'twitter' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleSocialConnect('twitter')}
                  disabled={connectingProvider === 'twitter'}
                  className="px-4 py-1.5 border border-primary text-primary rounded-xl text-[10px] font-bold cursor-pointer bg-transparent hover:bg-primary/10 transition border-none flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectingProvider === 'twitter' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="12" height="12" className="text-primary fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      {isLoggedInWithProvider ? 'Reconnect' : 'Connect'}
                    </>
                  )}
                </button>
              )}
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
