import { useState } from "react";

const CountDown = (props: any) => {
    const { setStartCountdown, setGameStarted } = props;
    const [count, setCount] = useState(3);
    
    setTimeout(() => {
        if (count > 0) {
        setCount(count - 1);
        }
    }, 1000);
    if (count === 0) {
        setStartCountdown(true);
        setGameStarted(true);
    }
    return <div>{count}</div>;
    };

export default CountDown;