import Profile from "../compononts/Profile";

export default function Page({ params }: { params: { slug: string } }) {
  return <Profile id={params.slug} />;
}
