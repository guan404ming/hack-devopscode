import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

const Register = () => {
  return (
    <CardFooter className="flex justify-between">
      <Button asChild variant="link" size="sm" className="px-0" type="button">
        {/* TODO 1.3: Route Configuration for Login and Register Pages (8%) */}
        {/* This link should link to the login page. */}
        {/* You can think of `Link`'s `to` prop as the anchor's `href` attribute. */}
        {/* This Link should have the text "Already have an account?" */}
        <Link to="/login" data-testid="link-login">
          Already have an account?
        </Link>
        {/* End of TODO 1.3 */}
      </Button>
      <Button size="sm">Register</Button>
    </CardFooter>
  );
};

export default Register;
