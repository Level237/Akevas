import { useGetUserQuery } from '@/services/auth';
import Header from '@/components/dashboard/user/layouts/header';
import MobileNav from '../ui/mobile-nav';

const UserRootDashboard = ({ children }: { children: React.ReactNode }) => {
  const { data: userData } = useGetUserQuery('Auth');



  return (
    <div className="min-h-screen bg-gray-50">

      <Header userData={userData} />
      <main className="container mx-auto px-4 py-8">
        {children}
        <MobileNav />
      </main>
    </div>
  );
};

export default UserRootDashboard; 