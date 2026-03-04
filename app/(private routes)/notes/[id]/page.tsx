import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: NotePageProps): Promise<Metadata> => {
  const { id } = await params;

  // Generic metadata - can't fetch protected data on server
  return {
    title: 'Note details',
    description: 'Detailed note view',
    openGraph: {
      title: 'Note details',
      description: 'View your note',
      url: `https://07-routing-nextjs-sage.vercel.app/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'View note details',
        },
      ],
      type: 'article',
    },
  };
};

// No protected fetch here - client will fetch with auth token
const NoteDetails = async ({ params }: NotePageProps) => {
  const { id } = await params;

  return <NoteDetailsClient id={id} />;
};

export default NoteDetails;
