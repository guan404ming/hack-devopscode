type FAQ = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQ[] = [
  {
    question: 'Stop redirecting me to the login page!',
    answer: (
      <>
        You can go to the <code>frontend/src/contexts/UserContext.tsx</code>{' '}
        file and remove the <code>useEffect</code> hook. (Don&apos;t forget to
        put back the <code>useEffect</code> hook when you&apos;re done testing!)
      </>
    ),
  },
];

export default faqs;
