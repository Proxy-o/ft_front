export type User = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  status?: string;
};

export type t_Game = {
  player1: User;
  player1Score: number;
  player2: User;
  player2Score: number;
  winner: User;
  timestamp: string;
};

export type Invitation = {
  id: string,
  sender: {
      id: string,
      username: string,
      avatar: string,
  },
  receiver: {
      id: string,
      username: string,
      avatar: string,
  },
  timestamp: string,
  is_accepted: boolean,
};
