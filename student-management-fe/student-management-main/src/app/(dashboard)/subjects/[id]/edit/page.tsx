import SubjectsPage from '@/modules/subject/components/SubjectsPage';

export default function Page({ params }: { params?: { id: string } }) {
  return <SubjectsPage initialEditingId={params?.id} />;
}
