import type { Metadata } from 'next';
import PostPage from '@/components/Community/PostPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} • Community • NEXCT Terminal`,
    description: 'Community post on NEXCT Terminal.',
  };
}

export default async function CommunityPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostPage slug={slug} />;
}
