import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import firebaseConfig from '../config/firebase';

// Initialize Firebase with error handling
let app;
let auth;
let isFirebaseInitialized = false;

try {
  // Check if Firebase config has valid values (not placeholders)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY" && 
      firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    isFirebaseInitialized = true;
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase config contains placeholder values. Phone authentication will not work until proper config is provided.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

class FirebasePhoneAuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  // Initialize reCAPTCHA verifier
  initializeRecaptcha(containerId, invisible = false) {
    if (!isFirebaseInitialized) {
      throw new Error("Firebase is not initialized. Please check your Firebase configuration.");
    }
    
    try {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: invisible ? 'invisible' : 'normal',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log('reCAPTCHA expired');
        }
      });
      return this.recaptchaVerifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      throw error;
    }
  }

  // Send OTP to phone number
  async sendOtp(phoneNumber, containerId) {
    console.log('Firebase initialized:', isFirebaseInitialized);
    console.log('Sending OTP to:', phoneNumber);
    console.log('Container ID:', containerId);
    
    if (!isFirebaseInitialized) {
      console.error('Firebase not initialized');
      return { success: false, message: 'Firebase is not configured. Please set up Firebase configuration first.' };
    }
    
    try {
      if (!this.recaptchaVerifier) {
        console.log('Initializing reCAPTCHA...');
        this.initializeRecaptcha(containerId);
      }

      console.log('Calling signInWithPhoneNumber...');
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        this.recaptchaVerifier
      );
      
      this.confirmationResult = confirmationResult;
      console.log('OTP sent successfully');
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('=== OTP SENDING ERROR ===');
      console.error('Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to send OTP';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please include country code (e.g., +91 for India)';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Firebase free tier has limited SMS. Please try again later or upgrade your Firebase plan.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again. Firebase has rate limits to prevent abuse.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'reCAPTCHA verification failed. Please refresh the page and try again.';
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage = 'Firebase configuration error. Please check your Firebase setup.';
      } else if (error.code === 'auth/app-not-authorized') {
        errorMessage = 'Firebase app not authorized. Please check your Firebase project settings.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized in Firebase. Please add localhost to your Firebase authorized domains.';
      } else if (error.code === 'auth/billing-not-enabled') {
        errorMessage = 'Firebase billing is not enabled. Please enable billing in Firebase Console to use phone authentication.';
      } else {
        errorMessage = `Firebase error: ${error.message || error.code}`;
      }
      
      return { success: false, message: errorMessage, error: error.code };
    }
  }

  // Verify OTP and get Firebase token
  async verifyOtp(otpCode) {
    console.log('Verifying OTP:', otpCode);
    
    if (!isFirebaseInitialized) {
      return { success: false, message: 'Firebase is not configured. Please set up Firebase configuration first.' };
    }
    
    try {
      if (!this.confirmationResult) {
        throw new Error('No pending OTP verification. Please request OTP first.');
      }

      const result = await this.confirmationResult.confirm(otpCode);
      const user = result.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      return { 
        success: true, 
        message: 'Phone verified successfully',
        idToken: idToken,
        phoneNumber: user.phoneNumber,
        uid: user.uid
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      let errorMessage = 'Invalid OTP code';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please request a new one';
      }
      
      return { success: false, message: errorMessage, error: error.code };
    }
  }

  // Clear reCAPTCHA verifier
  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }

  // Check if Firebase is properly initialized
  isInitialized() {
    return isFirebaseInitialized;
  }
}

export default new FirebasePhoneAuthService();