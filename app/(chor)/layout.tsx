import SearchFriend from "./profile/components/searchFriend";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SearchFriend />
      {children}
    </>
  );
}
