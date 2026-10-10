import TeacherDetailPage from '@/modules/teacher/components/TeacherDetailPage';

export default function Page({ params }: { params?: { id: string } }) {
  return <TeacherDetailPage params={params} />;
}
