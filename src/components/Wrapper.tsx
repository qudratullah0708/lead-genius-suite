import { ReactNode } from 'react';
import SidebarLayout from './layout/Sidebar';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
};

export default Wrapper;
