import * as React from 'react';
import { useEffect } from 'react';
import { useStigContext } from '@/contexts/StigContext';
import Icon from '@mdi/react';
import { mdiRocketLaunchOutline } from '@mdi/js';

const AdvancedPanelToggle: React.FC = () => {
    const { isPropertyPanelOpen, togglePropertiesSetTab } = useStigContext();

    useEffect(() => {
        //setIsPropertyPanelOpen(!isPropertyPanelOpen);
    }, [isPropertyPanelOpen]);

    return (
        <label className="swap swap-rotate text-neutralc-300 hover:text-white" >
            <input onClick={() => togglePropertiesSetTab(1)} type="checkbox" />
            <span title='Advanced Properties'><Icon path={mdiRocketLaunchOutline} size={1} /></span>
        </label>
    );
};

export default AdvancedPanelToggle;
