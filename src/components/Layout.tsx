import { FC, ReactNode } from "react";

import { Link } from "react-router";

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = (props) => {
  const { children } = props;

  return (
    <div>
      <header
        style={{
          padding: 12,
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: 12,
        }}
      >
        <Link to="/heroes">Superhero DB</Link>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
