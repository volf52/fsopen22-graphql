const Page = ({ show, children }) => {
  if (!show) return null;

  return <>{children}</>;
};

export default Page;
