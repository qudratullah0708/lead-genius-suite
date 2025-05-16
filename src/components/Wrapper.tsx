
import { ReactNode } from 'react';
import Navbar from './layout/Navbar';
import SidebarLayout from './layout/Sidebar';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </div>
    </div>
  );
};

export default Wrapper;
