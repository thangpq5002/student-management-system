import StudentDetailPage from '@/modules/student/components/StudentDetailPage';

export default function Page({ params }: { params?: { id: string } }) {
  return <StudentDetailPage params={params} />;
}
