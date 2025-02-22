import { Outlet } from 'react-router-dom';

const AppLayout = (): React.ReactNode => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-screen w-[88vw] flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
