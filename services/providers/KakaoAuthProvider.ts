import { AbstractAuthProvider } from './AbstractAuthProvider';
import { 
  User, 
  AuthProvider, 
  KakaoUserInfo,
  KakaoAuthResponse,
  KakaoLoginOptions
} from '../../types';
import { KAKAO_APP_KEY } from '../../constants';

export class KakaoAuthProvider extends AbstractAuthProvider {

  public getProvider(): AuthProvider {
    return AuthProvider.KAKAO;
  }

  /**
   * Initialize Kakao SDK
   */
  public async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      const checkKakaoLoaded = () => {
        if (window.Kakao) {
          try {
            if (!window.Kakao.isInitialized()) {
              window.Kakao.init(KAKAO_APP_KEY);
            }
            this.isInitialized = true;
            resolve();
          } catch (error) {
            reject(new Error('Failed to initialize Kakao SDK'));
          }
        } else {
          setTimeout(checkKakaoLoaded, 100);
        }
      };

      checkKakaoLoaded();

      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Kakao SDK failed to load'));
        }
      }, 10000);
    });
  }

  /**
   * Sign in with Kakao
   */
  public async signIn(): Promise<User> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!window.Kakao?.Auth) {
        reject(new Error('Kakao Auth not available'));
        return;
      }

      const loginOptions: KakaoLoginOptions = {
        success: async (authObj: KakaoAuthResponse) => {
          try {
            const user = await this.getUserInfo(authObj.access_token);
            this.storeAuthData(authObj.access_token, user, AuthProvider.KAKAO);
            
            window.dispatchEvent(new CustomEvent('kakaoLoginSuccess', { detail: user }));
            resolve(user);
          } catch (error) {
            reject(error);
          }
        },
        fail: (error: any) => {
          console.error('Kakao login failed:', error);
          window.dispatchEvent(new CustomEvent('kakaoLoginError', { detail: error }));
          reject(new Error('Kakao login failed'));
        },
        scope: 'profile_nickname,profile_image,account_email'
      };

      window.Kakao.Auth.login(loginOptions);
    });
  }

  /**
   * Get user information from Kakao API
   */
  private async getUserInfo(accessToken: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!window.Kakao?.API) {
        reject(new Error('Kakao API not available'));
        return;
      }

      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (response: KakaoUserInfo) => {
          const user: User = {
            uid: response.id.toString(),
            displayName: response.kakao_account?.profile?.nickname || 
                        response.properties?.nickname || 
                        'Kakao User',
            email: response.kakao_account?.email || null,
            photoURL: response.kakao_account?.profile?.profile_image_url || 
                     response.properties?.profile_image || null,
            provider: AuthProvider.KAKAO,
          };
          resolve(user);
        },
        fail: (error: any) => {
          console.error('Failed to get Kakao user info:', error);
          reject(new Error('Failed to get user information'));
        }
      });
    });
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const credential = this.getStoredCredential();
    const user = this.getCurrentUser();
    
    if (!credential || !user) {
      return false;
    }

    // 카카오 토큰이 유효한지 확인
    if (window.Kakao?.Auth) {
      const token = window.Kakao.Auth.getAccessToken();
      return !!token;
    }

    return true; // Kakao SDK가 로드되지 않은 경우 저장된 정보만으로 판단
  }

  /**
   * Sign out the user
   */
  public async signOut(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (window.Kakao?.Auth) {
          window.Kakao.Auth.logout(() => {
            this.clearAuthData();
            window.dispatchEvent(new CustomEvent('kakaoLogoutSuccess'));
            resolve();
          });
        } else {
          this.clearAuthData();
          window.dispatchEvent(new CustomEvent('kakaoLogoutSuccess'));
          resolve();
        }
      } catch (error) {
        console.error('Error during Kakao sign out:', error);
        // 에러가 발생해도 로컬 데이터는 정리
        this.clearAuthData();
        resolve();
      }
    });
  }
}

