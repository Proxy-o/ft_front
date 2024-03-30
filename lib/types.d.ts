export type User = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  status?: string;
  date_joined?: string;
};

export type t_Game = {
  id: string;
  user1: User;
  user1Score: number;
  user2: User;
  user2Score: number;
  winner: User;
  timestamp: string;
};

export type Invitation = {
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
  is_accepted: boolean;
};
