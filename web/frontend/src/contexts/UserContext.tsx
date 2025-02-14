import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '@shared/types';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { UserService } from '@/services/userService';

type UserContextType = {
  user: User | null;
  authenticated: boolean;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  upvote: (postId: string) => void;
  downvote: (postId: string) => void;
  undoUpvote: (postId: string) => void;
  undoDownvote: (postId: string) => void;
  updateProfile: (payload: User.Put.Payload) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  /* TODO 1.2: Redirect to Login Page (5%) */
  /* Add a useEffect hook that redirects the user to the login page if they are not authenticated. */
  /* Only redirect if the user is not on the login or register page. */
  /* Use the `navigate('/login')` function to redirect the user. */
  /* Reference: https://reactrouter.com/en/6.16.0/hooks/use-navigate */
  /*            https://reactrouter.com/en/6.16.0/hooks/use-location */
  /*            https://github.com/remix-run/history/blob/main/docs/api-reference.md#location */
  useEffect(() => {
    if (!authenticated && !['/login', '/register'].includes(location.pathname))
      navigate('/login');
  }, [authenticated, location, navigate]);
  /* Reminder: Don't import this useEffect hook if you are tired of being redirected to the login page. */
  /* Warning: But remember to add it back before submitting your work. */
  /* End of TODO 1.2 */

  const login = async (username: string, password: string) => {
    try {
      const userData = await UserService.login({ username, password });
      setUser(userData);
      setAuthenticated(true);
      navigate('/view');
    } catch (error) {
      toast({
        description:
          error instanceof AxiosError
            ? error.response?.data.message
            : 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  const register = async (username: string, password: string) => {
    await UserService.register({ username, password });
    navigate('/login');
  };

  const upvote = (postId: string) => {
    if (authenticated === null) return;
    setUser((prevUser) => {
      if (prevUser === null) return null;
      const newUser = { ...prevUser };
      newUser.upvotes = [...newUser.upvotes, postId];
      return newUser;
    });
  };

  const downvote = (postId: string) => {
    if (authenticated === null) return;
    setUser((prevUser) => {
      if (prevUser === null) return null;
      const newUser = { ...prevUser };
      newUser.downvotes = [...newUser.downvotes, postId];
      return newUser;
    });
  };

  const undoUpvote = (postId: string) => {
    if (authenticated === null) return;
    setUser((prevUser) => {
      if (prevUser === null) return null;
      const newUser = { ...prevUser };
      newUser.upvotes = newUser.upvotes.filter((x) => x !== postId);
      return newUser;
    });
  };

  const undoDownvote = (postId: string) => {
    if (authenticated === null) return;
    setUser((prevUser) => {
      if (prevUser === null) return null;
      const newUser = { ...prevUser };
      newUser.downvotes = newUser.downvotes.filter((x) => x !== postId);
      return newUser;
    });
  };

  const updateProfile = async (payload: User.Put.Payload) => {
    const updatedUser = await UserService.updateProfile(payload);
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        authenticated,
        login,
        register,
        upvote,
        downvote,
        undoUpvote,
        undoDownvote,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const userContext = useContext(UserContext);
  if (userContext === null)
    throw new Error('UserContext should only be used inside UserProvider.');
  return userContext;
};
