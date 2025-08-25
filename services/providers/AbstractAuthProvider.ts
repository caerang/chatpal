import { User, AuthProvider, IAuthProvider } from '../../types';
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY, AUTH_PROVIDER_KEY } from '../../constants';

export abstract class AbstractAuthProvider implements IAuthProvider {
  protected isInitialized = false;

  abstract initialize(): Promise<void>;
  abstract signIn(): Promise<User>;
  abstract signOut(): Promise<void>;
  abstract getProvider(): AuthProvider;

  /**
   * Store authentication data in localStorage
   */
  protected storeAuthData(credential: string, user: User, provider: AuthProvider): void {
    localStorage.setItem(AUTH_STORAGE_KEY, credential);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_PROVIDER_KEY, provider);
  }

  /**
   * Get stored user data
   */
  public getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      const storedProvider = localStorage.getItem(AUTH_PROVIDER_KEY);
      
      if (!userStr || !storedProvider || storedProvider !== this.getProvider()) {
        return null;
      }
      
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Get stored credential
   */
  protected getStoredCredential(): string | null {
    const storedProvider = localStorage.getItem(AUTH_PROVIDER_KEY);
    
    if (storedProvider !== this.getProvider()) {
      return null;
    }
    
    return localStorage.getItem(AUTH_STORAGE_KEY);
  }

  /**
   * Clear stored authentication data
   */
  protected clearAuthData(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
  }

  /**
   * Check if user is authenticated (basic implementation)
   */
  public isAuthenticated(): boolean {
    const credential = this.getStoredCredential();
    const user = this.getCurrentUser();
    
    return !!(credential && user);
  }
}

