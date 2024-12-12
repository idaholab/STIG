import React, { useContext, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiPlay } from '@mdi/js';
import ConnectedDBContext, { ConnectedDBContextType } from '@/contexts/ConnectedDBContext';
import ButtonIcon from './ButtonIcon';

type ExampleQueryCardComponentProps = {
    title: string;
    description: string;
    query: string;
    onRunQuery: (query: string) => void;
}

const ExampleQueryCardComponent: React.FC<ExampleQueryCardComponentProps> = ({ title, description, query, onRunQuery }) => {
    const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="ExampleQueryCardComponent p-2 justify-center flex flex-col dark:bg-neutralc-900 bg-neutralc-100 w-full h-fit shadow-sm rounded-md border dark:border-neutralc-500 group">
            <div className="flex flex-col ">
                <span className='flex items-center justify-between w-full cursor-pointer dark:text-neutralc-200 text:neutralc-900 hover:text-black hover:dark:text-white'>
                    <span className='flex items-center' onClick={toggleCollapse}>
                        <div className="text-base m-0 p-0 ">
                            {title}
                        </div>
                        <Icon
                            path={mdiChevronDown}
                            size={.9}
                            className={`ml-4 transition transition-transform duration-300 ease ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </span>
                    <span className='ml-2 flex items-center justify-center min-w-[24px]'>
                        <ButtonIcon type={'btn-primary'} disabled={!connectedDBProfile} buttonIcon={mdiPlay} iconText='Run Query'
                            additionalClasses={"btn-xs hidden group-hover:inline w-fit"} onClick={() => onRunQuery(query)}>
                        </ButtonIcon>
                    </span>
                </span>
                <div className={`${isCollapsed ? 'flex flex-col p-0 m-0 text-xs text-neutralc-900 dark:text-neutralc-300' : 'hidden'}`}>
                    <p className='mt-2'>{description}</p>
                    <p className='mt-2'>{query}</p>
                </div>
            </div>
        </div>
    );
};

export default ExampleQueryCardComponent;