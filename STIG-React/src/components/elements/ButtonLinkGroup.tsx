import * as React from 'react';
import { useLocation } from 'react-router-dom';
import ButtonBasic from './ButtonBasic';

type ButtonProps = {
  /**
   * Routing base for button click
   */
  baseRoute?: string;
  /**
   * Button link locations and labels for each button
   */
  actions: Array<{
    /**
     * Button contents
     */
    label: string;
    /**
     * Button link
     */
    link: string;
  }>;
};

const ButtonLinkGroup: React.FC<ButtonProps> = ({ baseRoute, actions }) => {
  const location = useLocation();
  const [selectedButton, setSelectedButton] = React.useState(0);

  const currentPath = location.pathname.split('/').pop();
  const isBaseRoute = location.pathname === baseRoute;

  React.useEffect(() => {
    if (isBaseRoute) {
      setSelectedButton(0);
    } else {
      const index = actions.findIndex((action) => action.link.split('/').pop() === currentPath);
      setSelectedButton(index !== -1 ? index : 0);
    }
  }, [location, currentPath, isBaseRoute, actions]);

  return (
    <div className="join gap-0 dark:gap-0.5">
      {actions.map((action, index) => {
        const isMatch = selectedButton === index;
        const color = isMatch ? 'btn-primary' : 'btn-neutralc';
        const additionalClasses = !isMatch ? 'dark:!border-none' : '';

        return (
          <ButtonBasic
            key={index}
            label={action.label}
            link={action.link}
            type={color}
            additionalClasses={`join-item ${additionalClasses}`}
          />
        );
      })}
    </div>
  );
};

export default ButtonLinkGroup;
