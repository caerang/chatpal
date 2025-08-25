
// Authentication Provider Types
export enum AuthProvider {
  GOOGLE = 'google',
  KAKAO = 'kakao'
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  provider: AuthProvider; // 추가: 어떤 프로바이더로 로그인했는지
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  correction?: string | null;
  originalText?: string | null; // User's original text for the "Share a Tip" feature
  timestamp: Date;
}

// Google Identity Services Types
export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

export interface GoogleUserInfo {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

// Kakao Types
export interface KakaoUserInfo {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile_nickname_needs_agreement?: boolean;
    profile_image_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    has_email?: boolean;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
  };
}

export interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  refresh_token_expires_in?: number;
}

// Global Window Types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonConfig) => void;
          disableAutoSelect: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
      Kakao?: {
        init: (appKey: string) => void;
        isInitialized: () => boolean;
        Auth: {
          login: (options: KakaoLoginOptions) => void;
          logout: (callback?: () => void) => void;
          getAccessToken: () => string | null;
        };
        API: {
          request: (options: KakaoApiRequestOptions) => void;
        };
      };
    };
  }
}

export interface GoogleIdConfig {
  client_id: string;
  callback: (credentialResponse: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

export interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  type?: 'standard' | 'icon';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
}

export interface KakaoLoginOptions {
  success: (authObj: KakaoAuthResponse) => void;
  fail: (err: any) => void;
  scope?: string;
}

export interface KakaoApiRequestOptions {
  url: string;
  success: (response: any) => void;
  fail: (error: any) => void;
}

// Abstract Auth Provider Interface
export interface IAuthProvider {
  initialize(): Promise<void>;
  signIn(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
  getProvider(): AuthProvider;
}
