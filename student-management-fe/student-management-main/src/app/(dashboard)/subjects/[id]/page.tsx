import SubjectDetailPage from '@/modules/subject/components/SubjectDetailPage';

export default function Page({ params }: { params?: { id: string } }) {
  return <SubjectDetailPage params={params} />;
}
