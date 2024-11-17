export type User = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  status?: string;
  score?: number;
  date_joined?: string;
  has_unread_messages?: boolean;
  otp_active?: boolean;
  qr_code?: string;
};

export type t_Game = {
  id: string;
  user1: User;
  user2: User;
  user3: User;
  user4: User;
  Score1: number;
  Score2: number;
  winner: User;
  timestamp: string;
};

export type t_Invitation = {
  id: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  receiver: {
    id: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  type: string;
  is_accepted: boolean;
};

export type OAuthCallbackParams = {
  provider: readonly string | null;
  code: readonly string | null;
  state: readonly string | null;
};

export type OAuthCallbackResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
  };
};

export type LoginParams = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
  };
};
