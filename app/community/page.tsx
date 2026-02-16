import type { Metadata } from 'next';
import CommunityPage from '@/components/Community/CommunityPage';

export const metadata: Metadata = {
  title: 'Community • NEXCT Terminal',
  description: 'Discussions, coin analysis, jobs, and tools from the NEXCT Terminal community.',
};

export default function Community() {
  return <CommunityPage />;
}
