import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import RootLayout from '@/RootLayout';
import { Toaster } from '@/components/ui/toaster';
import { PostsProvider } from '@/contexts/PostContext';
import { UserProvider } from '@/contexts/UserContext';
import Create from '@/routes/Create';
import Layout from '@/routes/Layout';
import View from '@/routes/View';
import AuthLayout from '@/routes/auth/Layout';
import Login from '@/routes/auth/Login';
import Register from '@/routes/auth/Register';
import FAQ from '@/routes/settings/FAQ';
import SettingsLayout from '@/routes/settings/Layout';
import Profile from '@/routes/settings/Profile';

const ProviderWrapper = (): React.ReactNode => {
  return (
    <UserProvider>
      <PostsProvider>
        <RootLayout />
        <Toaster />
      </PostsProvider>
    </UserProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    Component: ProviderWrapper,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: 'register', Component: Register },
          { path: 'login', Component: Login },
        ],
      },
      {
        Component: Layout,
        children: [
          { path: 'view', Component: View },
          { path: 'create', Component: Create },
          {
            path: 'settings',
            Component: SettingsLayout,
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              { path: 'profile', Component: Profile },
              { path: 'faq', Component: FAQ },
            ],
          },
        ],
      },
    ],
  },
]);

const App = (): React.ReactNode => {
  return <RouterProvider router={router} />;
};

export default App;
