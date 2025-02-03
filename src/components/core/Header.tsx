import * as React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AdvancedPanelToggle from './AdvancedPanelToggle';

const Header: React.FC = () => {
  return (
    <div className="navbar bg-primary flex items-center justify-between px-7">
      <Link to="/" className="flex items-center logo-btn cursor-pointer">
        <img src={import.meta.env.BASE_URL + "/CyOTE_logo_23-0807_nostars.svg"} alt="COREII logo" />
        <label className='ml-4 text-xl text-white'>STIG</label>
      </Link>
      <span className='flex gap-3'>
        <ThemeToggle />
        <AdvancedPanelToggle />
      </span>
    </div>
  );
};

export default Header;
