export interface WhitelistEntry {
  id: string;
  userId: string;
  senderOrDomain: string;
  createdAt: string;
}

export interface BlacklistEntry {
  id: string;
  userId: string;
  senderOrDomain: string;
  createdAt: string;
}
