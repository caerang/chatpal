import { AbstractAuthProvider } from './AbstractAuthProvider';
import { 
  User, 
  AuthProvider, 
  GoogleCredentialResponse, 
  GoogleUserInfo,
  GoogleIdConfig,
  GoogleButtonConfig
} from '../../types';
import { GOOGLE_CLIENT_ID } from '../../constants';

export class GoogleAuthProvider extends AbstractAuthProvider {
  private pendingPromise: { resolve: (user: User) => void; reject: (error: any) => void } | null = null;

  public getProvider(): AuthProvider {
    return AuthProvider.GOOGLE;
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
          setTimeout(checkGoogleLoaded, 100);
        }
      };

      checkGoogleLoaded();

      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Google Identity Services failed to load'));
        }
      }, 10000);
    });
  }

  /**
   * Sign in with Google
   */
  public async signIn(): Promise<User> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.pendingPromise = { resolve, reject };
      
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.prompt();
        } else {
          reject(new Error('Google Identity Services not available'));
        }
      } catch (error) {
        this.pendingPromise = null;
        reject(error);
      }
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
        provider: AuthProvider.GOOGLE,
      };

      this.storeAuthData(response.credential, user, AuthProvider.GOOGLE);
      
      if (this.pendingPromise) {
        this.pendingPromise.resolve(user);
        this.pendingPromise = null;
      }
      
      window.dispatchEvent(new CustomEvent('googleLoginSuccess', { detail: user }));
    } catch (error) {
      if (this.pendingPromise) {
        this.pendingPromise.reject(error);
        this.pendingPromise = null;
      }
      
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
   * Check if user is authenticated (with token expiry check)
   */
  public isAuthenticated(): boolean {
    const credential = this.getStoredCredential();
    const user = this.getCurrentUser();
    
    if (!credential || !user) {
      return false;
    }

    try {
      const userInfo = this.parseJwtToken(credential);
      const currentTime = Math.floor(Date.now() / 1000);
      return userInfo.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sign out the user
   */
  public async signOut(): Promise<void> {
    try {
      this.clearAuthData();

      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      window.dispatchEvent(new CustomEvent('googleLogoutSuccess'));
    } catch (error) {
      console.error('Error during Google sign out:', error);
      throw error;
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
}

