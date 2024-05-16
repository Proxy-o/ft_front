export type User = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  status?: string;
  date_joined?: string;
  has_unread_messages?: boolean;
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
  type: string;
  is_accepted: boolean;
};
