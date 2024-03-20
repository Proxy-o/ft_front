import { useState, useEffect } from "react";

const CountDown = (props: any) => {
    const { setStartCountdown, setGameStarted } = props;
    const [count, setCount] = useState(3);

    useEffect(() => {
        // let var = count > 0 ;
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (count === 0) {
            setStartCountdown(true);
            setGameStarted(true);
        }
    }, [count]);

    return <div>{count}</div>;
};

export default CountDown;
