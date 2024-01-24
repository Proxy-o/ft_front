export interface Games {
    player1: {
        name: string;
        score: string;
        status: "win" | "lose" | "draw";
    };
    player2: {
        name: string;
        score: string;
        status: "win" | "lose" | "draw";

    };
    date: string;
}

export interface Friend{
    name: string;
    avatar: string;
}