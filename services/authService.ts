import { 
  GoogleCredentialResponse, 
  GoogleUserInfo, 
  User, 
  GoogleIdConfig, 
  GoogleButtonConfig 
} from '../types';
import { 
  GOOGLE_CLIENT_ID, 
  AUTH_STORAGE_KEY, 
  USER_STORAGE_KEY 
} from '../constants';

export class AuthService {
  private static instance: AuthService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize Google Identity Services
   */
  public async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      const checkGoogleLoaded = () => {
        if (window.google?.accounts?.id) {
          const config: GoogleIdConfig = {
            client_id: GOOGLE_CLIENT_ID,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
          };

          window.google.accounts.id.initialize(config);
          this.isInitialized = true;
          resolve();
        } else {
          // Retry after a short delay
          setTimeout(checkGoogleLoaded, 100);
        }
      };

      // Start checking immediately
      checkGoogleLoaded();

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Google Identity Services failed to load'));
        }
      }, 10000);
    });
  }

  /**
   * Handle the credential response from Google
   */
  private async handleCredentialResponse(response: GoogleCredentialResponse): Promise<void> {
    try {
      const userInfo = this.parseJwtToken(response.credential);
      const user: User = {
        uid: userInfo.sub,
        displayName: userInfo.name,
        email: userInfo.email,
        photoURL: userInfo.picture,
      };

      // Store authentication data
      this.storeAuthData(response.credential, user);
      
      // Trigger custom event for login success
      window.dispatchEvent(new CustomEvent('googleLoginSuccess', { detail: user }));
    } catch (error) {
      console.error('Error handling credential response:', error);
      window.dispatchEvent(new CustomEvent('googleLoginError', { detail: error }));
    }
  }

  /**
   * Parse JWT token to extract user information
   */
  private parseJwtToken(token: string): GoogleUserInfo {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Failed to parse JWT token');
    }
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(credential: string, user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEY, credential);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  public getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Get stored credential
   */
  public getStoredCredential(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const credential = this.getStoredCredential();
    const user = this.getStoredUser();
    
    if (!credential || !user) {
      return false;
    }

    // Check if token is expired
    try {
      const userInfo = this.parseJwtToken(credential);
      const currentTime = Math.floor(Date.now() / 1000);
      return userInfo.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Render Google Sign-In button
   */
  public renderButton(element: HTMLElement, options?: Partial<GoogleButtonConfig>): void {
    if (!this.isInitialized || !window.google?.accounts?.id) {
      console.error('Google Identity Services not initialized');
      return;
    }

    const defaultOptions: GoogleButtonConfig = {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
      width: '320',
    };

    const buttonOptions = { ...defaultOptions, ...options };
    window.google.accounts.id.renderButton(element, buttonOptions);
  }

  /**
   * Show the One Tap prompt
   */
  public showOneTap(): void {
    if (!this.isInitialized || !window.google?.accounts?.id) {
      console.error('Google Identity Services not initialized');
      return;
    }

    window.google.accounts.id.prompt();
  }

  /**
   * Sign out the user
   */
  public async signOut(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      // Disable auto-select
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      // Trigger custom event for logout
      window.dispatchEvent(new CustomEvent('googleLogoutSuccess'));
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  /**
   * Revoke access (more complete sign out)
   */
  public async revokeAccess(): Promise<void> {
    try {
      const user = this.getStoredUser();
      
      if (user?.email && window.google?.accounts?.id) {
        return new Promise((resolve) => {
          window.google!.accounts.id.revoke(user.email!, () => {
            this.signOut();
            resolve();
          });
        });
      } else {
        await this.signOut();
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();