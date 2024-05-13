interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Game {
  user1: User;
  user1_score?: number;
  user2: User;
  user2_score?: number;
  user3: User?;
  user4: User?;
  winner: User?;
  timestamp: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
}
