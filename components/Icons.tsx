
import React from 'react';

interface IconProps {
  className?: string;
}

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M15.75 17.25a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4.5 10.5a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM15.75 4.5a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
    <path
      d="M8.293 12.28a5.14 5.14 0 010-3.06L14.47 5.94a5.22 5.22 0 010 1.06l-6.177 3.28zM8.293 14.72a5.14 5.14 0 000 3.06l6.177-3.28a5.22 5.22 0 000-1.06L8.293 14.72z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#34A853" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" transform="rotate(30 24 24)"/>
        <path fill="#FBBC05" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" transform="rotate(60 24 24)"/>
        <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" transform="rotate(90 24 24)"/>
    </svg>
);

export const KakaoIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#3C1E1E"
      d="M24 4C13.523 4 5 11.303 5 20.235c0 5.751 3.837 10.793 9.617 13.57l-2.465 8.816c-.159.572.437 1.048.95.758L21.17 36.85c.903.073 1.814.111 2.83.111c10.477 0 19-7.303 19-16.235S34.477 4 24 4z"
    />
    <path
      fill="#FFEB3B"
      d="M24 6C14.611 6 7 12.407 7 20.235c0 5.074 3.383 9.528 8.461 12.019l-2.172 7.768c-.111.401.306.734.666.532L21.617 34.7c.777.064 1.566.096 2.383.096c9.389 0 17-6.407 17-14.235S33.389 6 24 6z"
    />
  </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 18.866 17.866 22 14 22C10.134 22 7 18.866 7 15C7 11.134 10.134 8 14 8C17.866 8 21 11.134 21 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 15H14M18 15H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 9C3 5.13401 6.13401 2 10 2C13.866 2 17 5.13401 17 9C17 12.866 13.866 16 10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
