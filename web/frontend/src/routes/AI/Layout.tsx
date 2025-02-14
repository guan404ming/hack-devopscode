import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { HelpCircleIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const links = [
  { title: "Upgrade", icon: HelpCircleIcon, path: "upgrade" },
  { title: "Convert", icon: HelpCircleIcon, path: "convert" },
  { title: "Optimize", icon: HelpCircleIcon, path: "optimize" },
  { title: "Correct", icon: HelpCircleIcon, path: "correct" },
  { title: "Deploy", icon: HelpCircleIcon, path: "deploy" },
];

const AILayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-full overflow-hidden">
      <Tabs value={location.pathname}>
        <TabsList className="h-full flex-col justify-start">
          {links.map((link) => (
            <TabsTrigger
              asChild
              key={link.title}
              value={`/ai/${link.path}`}
              className="border-l-2 border-t-0 !border-b-[#444] data-[state=active]:border-l-button data-[state=active]:border-r-transparent [&.active]:border-l-button [&.active]:border-r-transparent"
            >
              <NavLink
                to={`/ai/${link.path}`}
                className="flex h-12 w-24 items-center justify-center"
              >
                {link.title}
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

export default AILayout;
