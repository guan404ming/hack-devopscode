import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { HelpCircleIcon, UserIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const links = [
  { title: 'Profile', icon: UserIcon, path: 'profile' },
  { title: 'FAQ', icon: HelpCircleIcon, path: 'faq' },
];

const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-full overflow-hidden">
      <Tabs value={location.pathname}>
        <TabsList className="h-full flex-col justify-start">
          {links.map((link) => (
            <TabsTrigger
              asChild
              key={link.title}
              value={`/settings/${link.path}`}
              className="border-l-2 border-t-0 !border-b-[#444] data-[state=active]:border-l-button data-[state=active]:border-r-transparent [&.active]:border-l-button [&.active]:border-r-transparent"
            >
              <NavLink
                to={`/settings/${link.path}`}
                className="flex h-12 w-12 items-center justify-center"
              >
                <link.icon size={24} strokeWidth={1.5} />
              </NavLink>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="w-full overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
