import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Code2Icon, PenLineIcon, Settings2Icon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  { title: 'View', icon: Code2Icon, path: 'view' },
  { title: 'Create', icon: PenLineIcon, path: 'create' },
  { title: 'Settings', icon: Settings2Icon, path: 'settings' },
];

const AppLayout = () => {
  const location = useLocation();

  return (
    <>
      <div className="mb-6 flex items-center gap-2 text-2xl font-semibold leading-none tracking-normal">
        <img
          src="/vscoddit.svg"
          alt="VSCoddit Logo"
          className="h-5 w-5 brightness-200"
        />
        VSCoddit
      </div>
      <Card className="max-w-screen-88 flex h-lg w-lg flex-col rounded-b rounded-t-none border-none">
        <Tabs value={location.pathname}>
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                asChild
                key={tab.title}
                value={`/${tab.path}`}
                className="px-8"
                data-testid={`tab-${tab.path}`}
              >
                <NavLink
                  to={`/${tab.path}`}
                  className="flex flex-row items-center justify-center gap-1.5"
                >
                  <tab.icon size={14} className="-ml-0.5" />
                  <span className="text-sm">{tab.title}</span>
                </NavLink>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Outlet />
      </Card>
    </>
  );
};

export default AppLayout;
