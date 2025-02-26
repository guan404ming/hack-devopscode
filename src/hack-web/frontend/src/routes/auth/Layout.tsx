import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { type FormEvent, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { title: 'Login', path: 'login' },
  { title: 'Register', path: 'register' },
];

/**
 * This page uses a simple form to login or register a user.
 * To see more advanced form handling, check out the `Profile.tsx`.
 */
const AuthLayout = () => {
  const location = useLocation();
  const { login, register } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    /* Have a think about where this function is called. */
    /* What will trigger this function to be called? */
    /* What is the default type of a button inside a form? */
    e.preventDefault();
    /* Have a think about why we need to prevent the default behavior of the form. */
    /* What happens if we don't prevent the default behavior? */
    if (location.pathname === '/login') {
      login(username, password);
      /* Replace the above line with the following line if you want to test other TODOs in this hackathon. */
      // login('test', '123');
      /* Warning: Remember to change it back if you want to test the login functionality. */
    } else {
      /* TODO 1.5: Ensure User Registration Functions Properly (8%) */
      /* If the user is registering, you need to check if the passwords match. */
      /* If the passwords do not match, you should show a toast with */
      /* description "Passwords do not match" */
      /* Here, a toast is a small, non-blocking notification pop-up. */
      /* They can be created via the `toast` function provided by `useToast()` */
      /* Reference: https://ui.shadcn.com/docs/components/toast#usage */
      if (password !== confirmPassword) {
        toast({
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }
      /* End of TODO 1.5 */
      register(username, password);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-sm border-none">
        <Tabs value={location.pathname}>
          <TabsList className="grid grid-cols-2">
            {tabs.map((tab) => (
              /* TODO 1.3: Route Configuration for Login and Register Pages (8%) */
              /* Each `TabsTrigger` should has a `value` the same as corresponding the pathname. */
              /* Inside each `TabsTrigger`, there should be a `NavLink` component. */
              /* You can think of `NavLink`'s `to` prop as the anchor's `href` attribute. */
              /* Each `NavLink` should use `title` as its content. */
              /* Reference: https://reactrouter.com/en/main/components/nav-link */
              /*            https://ui.shadcn.com/docs/components/tabs#usage */
              <TabsTrigger
                asChild
                key={tab.title}
                value={`/${tab.path}`}
                className="last-of-type:border-r-0"
                data-testid={`tab-${tab.path}`}
              >
                <NavLink to={`/${tab.path}`}>{tab.title}</NavLink>
              </TabsTrigger>
              /* End of TODO 1.3 */
            ))}
          </TabsList>
        </Tabs>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 tracking-normal">
            {/* TODO 1.1: Title and Login Page Title (5%) */}
            {/* Add a logo to the left of the title. */}
            {/* The logo should be vscoddit.svg in the public folder. */}
            {/* The logo should have alt text "VSCoddit Logo". */}
            {/* The title should be "VSCoddit" */}
            <img
              data-testid="header-logo"
              src="/vscoddit.svg"
              alt="VSCoddit Logo"
              className="h-5 w-5 brightness-200"
            />
            <span data-testid="header-title">deVopSCode</span>
            {/* END of TODO 1.1 */}
          </CardTitle>
          <CardDescription>
            {location.pathname === '/login'
              ? 'Login to Access Fragmented Coding Content'
              : 'Register to Access Fragmented Coding Content'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              {/* TODO 1.4: Login Fails for Unregistered Users (8%) */}
              {/* You can think of `Input` as the `input` tag. */}
              {/* It should be controlled by the `username` state. */}
              {/* It should have placeholder text "Enter Username". */}
              {/* It should be required. */}
              <Input
                id="username"
                data-testid="input-username"
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
              {/* End of TODO 1.4 */}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              {/* TODO 1.4: Login Fails for Unregistered Users (8%) */}
              {/* You can think of `Input` as the `input` tag. */}
              {/* It should be controlled by the `password` state. */}
              {/* It should have placeholder text "Enter Password". */}
              {/* It should be required. */}
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
              {/* End of TODO 1.4 */}
            </div>
            <div
              className={cn(
                'flex h-[76px] flex-col gap-2 transition-all duration-200',
                location.pathname === '/login' &&
                  'pointer-events-none !mt-0 h-0 opacity-0',
              )}
            >
              <Label htmlFor="confirm-password">Confirm Password</Label>
              {/* TODO 1.5: Ensure User Registration Functions Properly (8%) */}
              {/* You can think of `Input` as the `input` tag. */}
              {/* It should be controlled by the `confirmPassword` state. */}
              {/* It should have placeholder text "Confirm Password". */}
              {/* It should be required only if in the register page. */}
              <Input
                id="confirm-password"
                data-testid="input-confirm-password"
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required={location.pathname === '/register'}
              />
              {/* End of TODO 1.5 */}
            </div>
          </div>
        </CardContent>
        <Outlet />
      </Card>
    </form>
  );
};

export default AuthLayout;
