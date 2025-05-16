
import { ReactNode } from 'react';
import SidebarLayout from './layout/Sidebar';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </div>
  );
};

export default Wrapper;
