import NotePreview from './NotePreview.client';

type Props = {
  params: Promise<{ id: string }>;
};

// No protected fetch here - client will fetch with auth token
const PreviewPage = async ({ params }: Props) => {
  const { id } = await params;

  return <NotePreview id={id} />;
};

export default PreviewPage;
