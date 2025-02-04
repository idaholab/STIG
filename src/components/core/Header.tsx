import * as React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AdvancedPanelToggle from './AdvancedPanelToggle';

const Header: React.FC = () => {
  return (
    <div className="navbar bg-primary flex items-center justify-between px-7">
      <Link to="/" className="flex items-center logo-btn cursor-pointer">
        <img src={import.meta.env.BASE_URL + '/stig-logo-white.svg'} alt="Stig logo" />
        <span className="ml-4 text-xl text-white">STIG</span>
      </Link>
      <span className="flex gap-3">
        <ThemeToggle />
        <AdvancedPanelToggle />
      </span>
    </div>
  );
};

export default Header;
