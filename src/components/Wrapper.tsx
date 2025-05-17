
import { ReactNode } from 'react';
import { AppSidebar } from './layout/Sidebar';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
