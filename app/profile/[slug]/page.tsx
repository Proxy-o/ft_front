import Profile from "../components/Profile";

export default function Page({ params }: { params: { slug: string } }) {
  return <Profile id={params.slug} />;
}
