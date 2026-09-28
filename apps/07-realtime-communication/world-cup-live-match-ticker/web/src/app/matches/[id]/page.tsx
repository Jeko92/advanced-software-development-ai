import { MatchTicker } from '@/components/match-ticker';

export default async function MatchPage({
  params,
}: PageProps<'/matches/[id]'>) {
  const { id } = await params;
  return <MatchTicker matchId={id} />;
}
