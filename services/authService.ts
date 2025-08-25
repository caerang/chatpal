import { User, AuthProvider, IAuthProvider } from '../types';
import { GoogleAuthProvider } from './providers/GoogleAuthProvider';
import { KakaoAuthProvider } from './providers/KakaoAuthProvider';
import { AUTH_PROVIDER_KEY } from '../constants';

export class AuthService {
  private static instance: AuthService;
  private providers: Map<AuthProvider, IAuthProvider> = new Map();
  private currentProvider: IAuthProvider | null = null;

  private constructor() {
    this.providers.set(AuthProvider.GOOGLE, new GoogleAuthProvider());
    this.providers.set(AuthProvider.KAKAO, new KakaoAuthProvider());
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize all providers
   */
  public async initializeAll(): Promise<void> {
    const initPromises = Array.from(this.providers.values()).map(provider => 
      provider.initialize().catch(error => {
        console.warn(`Failed to initialize ${provider.getProvider()} provider:`, error);
      })
    );
    
    await Promise.allSettled(initPromises);
  }

  /**
   * Get provider by type
   */
  public getProvider(providerType: AuthProvider): IAuthProvider {
    const provider = this.providers.get(providerType);
    if (!provider) {
      throw new Error(`Provider ${providerType} not found`);
    }
    return provider;
  }

  /**
   * Sign in with specific provider
   */
  public async signIn(providerType: AuthProvider): Promise<User> {
    const provider = this.getProvider(providerType);
    const user = await provider.signIn();
    this.currentProvider = provider;
    return user;
  }

  /**
   * Get current authenticated user from any provider
   */
  public getCurrentUser(): User | null {
    // 먼저 저장된 프로바이더 확인
    const storedProvider = localStorage.getItem(AUTH_PROVIDER_KEY);
    if (storedProvider) {
      try {
        const providerType = storedProvider as AuthProvider;
        const provider = this.getProvider(providerType);
        const user = provider.getCurrentUser();
        if (user) {
          this.currentProvider = provider;
          return user;
        }
      } catch (error) {
        console.error('Error getting user from stored provider:', error);
      }
    }

    // 저장된 프로바이더가 없거나 실패한 경우 모든 프로바이더 확인
    for (const provider of this.providers.values()) {
      const user = provider.getCurrentUser();
      if (user) {
        this.currentProvider = provider;
        return user;
      }
    }

    return null;
  }

  /**
   * Check if any user is authenticated
   */
  public isAuthenticated(): boolean {
    const storedProvider = localStorage.getItem(AUTH_PROVIDER_KEY);
    if (storedProvider) {
      try {
        const providerType = storedProvider as AuthProvider;
        const provider = this.getProvider(providerType);
        return provider.isAuthenticated();
      } catch (error) {
        console.error('Error checking authentication with stored provider:', error);
      }
    }

    // 저장된 프로바이더가 없거나 실패한 경우 모든 프로바이더 확인
    return Array.from(this.providers.values()).some(provider => provider.isAuthenticated());
  }

  /**
   * Sign out current user
   */
  public async signOut(): Promise<void> {
    if (this.currentProvider) {
      await this.currentProvider.signOut();
      this.currentProvider = null;
      return;
    }

    // 현재 프로바이더가 설정되지 않은 경우 저장된 프로바이더 확인
    const storedProvider = localStorage.getItem(AUTH_PROVIDER_KEY);
    if (storedProvider) {
      try {
        const providerType = storedProvider as AuthProvider;
        const provider = this.getProvider(providerType);
        await provider.signOut();
        return;
      } catch (error) {
        console.error('Error signing out with stored provider:', error);
      }
    }

    // 모든 프로바이더에서 로그아웃 시도
    const signOutPromises = Array.from(this.providers.values()).map(provider =>
      provider.signOut().catch(error => {
        console.warn(`Failed to sign out from ${provider.getProvider()}:`, error);
      })
    );

    await Promise.allSettled(signOutPromises);
  }

  /**
   * Render Google button (backward compatibility)
   */
  public renderGoogleButton(element: HTMLElement, options?: any): void {
    const googleProvider = this.getProvider(AuthProvider.GOOGLE) as GoogleAuthProvider;
    googleProvider.renderButton(element, options);
  }

  /**
   * Legacy methods for backward compatibility
   */
  public async initialize(): Promise<void> {
    return this.initializeAll();
  }

  public getStoredUser(): User | null {
    return this.getCurrentUser();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();