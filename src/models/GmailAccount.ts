export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate?: number; // epoch ms
}

export interface GmailAccount {
  userId: string;
  tokens: OAuthTokens; // stored encrypted
  scopes: string[];
  connectedAt: string; // ISO date
}
