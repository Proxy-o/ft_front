import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { Avatar } from "@radix-ui/react-avatar";

const PreGame = ({ leftUser, rightUser } : { leftUser: React.MutableRefObject<User | undefined>, rightUser: React.MutableRefObject<User | undefined> }) => {
    return (
        <div className="flex flex-row lg:justify-center justify-between w-full h-full items-center">
            <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger ml-auto">
            <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md bg-gradient-to-r from-black to-primary justify-center items-center flex flex-col sckeliton ">
                <Avatar>
                    <AvatarImage
                        src={leftUser.current?.avatar}
                        alt="profile image"
                        className="w-20 h-20 lg:w-48 lg:h-48 rounded-md bg-primary/35"
                        />
                    <AvatarFallback className="rounded-sm">
                        ?
                    </AvatarFallback>
                </Avatar>
                        </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center m-auto">
                <h1 className="text-3xl text-white">VS</h1>
            </div>
            <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger mr-auto">
                <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md bg-gradient-to-r from-primary to-black justify-center items-center flex flex-col sckeliton2">
                    <Avatar>
                        <AvatarImage
                            src={rightUser.current?.avatar}
                            alt="profile image"
                            className="w-20 h-20 lg:w-48 lg:h-48 rounded-md bg-primary/35"
                            />
                        <AvatarFallback className="rounded-sm bg-black/35 w-20 h-20 lg:w-48 lg:h-48 text-5xl lg:text-9xl font-bold">
                            ?
                        </AvatarFallback>
                    </Avatar>
                </div>
                </div>
        </div>
    );
};

export default PreGame;


// todo try this animation

// .exampleClass {
// 	width: 120px;
// 	border-radius: 6px;
// 	height: 44px;
// 	background-image: linear-gradient(270deg, hsl(109, 0%, 12%), hsl(109, 0%, 20%), hsl(109, 0%, 20%), hsl(109, 0%, 12%));
// 	background-size: 400% 100%;
// 	animation: loading 8s ease-in-out infinite;
// }

// @keyframes loading {
// 	from {
// 		background-position: 200% 0;
// 	}
//     to {
// 		background-position: -200% 0;
//     }
// }

