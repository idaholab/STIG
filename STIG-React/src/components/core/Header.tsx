// React
import * as React from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import ThemeToggle from './ThemeToggle';

type Props = object;

const Header: React.FC<Props> = () => {

  return (
    <>
      <div className="navbar bg-primary text-primary-content sticky top-0 z-1000">
        <Link to="/" className="btn btn-ghost ml-2 p-0 normal-case rounded-full border-none logo-btn">
          <img src={import.meta.env.BASE_URL + "/CyOTE_logo_23-0807_nostars.svg"} alt="COREII logo" className="h-8" />
        </Link>

        <Link to="/" className="btn btn-ghost px-2 mx-1 normal-case btn-sm text-xl text-white">
          STIG React
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default Header;
