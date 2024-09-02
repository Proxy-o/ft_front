
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 pt-32 px-6 md:px-12 lg:px-24">
        <section className="mb-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  Welcome to Ft_transcendence
                </h2>
                <p className="text-muted-foreground text-lg mb-6 mt-6">
                  Discover the exciting world of table tennis and join our
                  vibrant community of players.
                </p>
                <div className="flex space-x-4 mt-24">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="p-4 inline-flex items-center justify-center rounded-md border border-primary text-primary font-medium transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <div className=" mx-auto w-full">
                <Image
                  src="/cute.jpg"
                  alt="Ping Pong"
                  className="rounded-lg shadow-lg w-full h-full"
                  width="500"
                  height="500"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container mx-auto pt-12">
            <h2 className="text-2xl font-bold mb-4">Modes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">1 VS 1</h3>
                <p className="text-muted-foreground">
                  Play against your friend in a classic match.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">2 vs 2</h3>
                <p className="text-muted-foreground">
                  Team up with a friend and compete against another team.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Tournament</h3>
                <p className="text-muted-foreground">
                  Join a tournament and compete against other players.
                </p>
              </div>
            </div>
          </div>
        </section>

<div className="w-full   mt-36 flex items-center justify-center">
<Link
                    href="/game/local"
                    className="inline-flex items-center justify-center rounded-md bg-primary/30 px-6 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Play Local
                  </Link>
</div>
      </main>
      {/* <footer className="bg-muted text-muted-foreground py-6 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; 2023 Ping Pong. All rights reserved.</p>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer> */}
    </div>
  );
}
