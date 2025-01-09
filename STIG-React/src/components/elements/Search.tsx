
import React, { useState, useEffect, useCallback } from 'react';
import { useStigContext } from '@/contexts/StigContext';
import { mdiClose, mdiLayersSearchOutline, mdiMagnify, mdiRefresh } from '@mdi/js';
import ButtonIcon from './ButtonIcon';
import { schema } from '@/stix/schema';
import FormSTIXPropertySelection from '../forms/FormSTIXPropertySelection';
import { SchemaSTIXProperty, SchemaSTIXStringType } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import Icon from '@mdi/react';
import ButtonBasic from './ButtonBasic';
import AlertComponent from './AlertComponent';

const SearchComponent: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [searchStatus, setSearchStatus] = useState('');
    const { setIsSearchOpen, cyInstance } = useStigContext();
    const [filterOptions, setFilterOptions] = useState<SchemaSTIXProperty[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<SchemaSTIXProperty[]>([]);

    // Function to handle removing a filter
    const removeFilter = useCallback((filterToRemove: SchemaSTIXProperty) => {
        setSelectedProperties(selectedProperties.filter(filter => filter !== filterToRemove));
    }, [selectedProperties]);

    type Property = { name: string; type: string; mandatory?: boolean; notNull?: boolean; };
    type Class = { name: string; properties: Property[]; };

    useEffect(() => {
        function getAllProperties(classes: Class[]): SchemaSTIXProperty[] { // replace SchemaSTIXProperty with your actual type
            const properties: SchemaSTIXProperty[] = [];
            const uniqueProps = new Set();
            let count: number = 0;
            for (const klass of classes) {
                for (const prop of klass.properties) {
                    const propObj = {
                        ...prop,
                        type: prop.type as SchemaSTIXStringType,
                    } as SchemaSTIXProperty;
                    if (!uniqueProps.has(propObj.name)) {
                        properties.push(propObj);
                        count++;
                        uniqueProps.add(propObj.name);
                    }
                }
            }
            console.log(`Property count: ${count}`);
            return properties.sort((a, b) => a.name.localeCompare(b.name));
        }
        setFilterOptions(getAllProperties(schema));
    }, []);

    function onCloseSearch() {
        setIsSearchOpen(false);
    }

    function searchGraph(cy: cytoscape.Core, prop: string, searchterm: string | number): cytoscape.CollectionReturnValue {
        let prop2: string | null = null;
        let prop3: string | null = null;
        searchterm = searchterm.toString().trim();
        if (prop.includes('.')) {
            const s = prop.split('.');
            prop2 = s[0];
            prop3 = s[1];
        }

        let returnValue = cy.elements().filter((ele) => {
            let ret: boolean = false;
            if (ele.data('raw_data')) {
                if (prop3 !== null) {
                    if (ele.data('raw_data')[prop2!]?.length > 0) {
                        ele.data('raw_data')[prop2!].forEach((eleArr: Record<string, string>) => {
                            //ret = eleArr[prop3 as any].trim() === searchterm;
                            ret = eleArr[prop3 as any]?.trim()?.includes(searchterm);
                        });
                    } else {
                        ret = ele.data('raw_data')[prop2!][0][prop3]?.trim() === searchterm;
                    }
                } else {
                    //ret = ele.data('raw_data')[prop] === searchterm;
                    ret = ele.data('raw_data')[prop]?.toString()?.includes(searchterm);
                }
            }
            if (ele.data(prop) !== undefined) {
                //ret = ele.data(prop).toString() === searchterm;
                ret = ele.data('raw_data')[prop]?.toString()?.includes(searchterm);
            }
            return ret;
        });

        return returnValue
    }

    const handleReset = () => {
        setSelectedProperties([]);
        setSearchText('');
        setSearchStatus('');
    }

    // Searchs activeFilters rather than just the property that is specified by prop = s[0];
    const handleSearch = () => {
        if (!cyInstance) {
            return
        }

        setSearchStatus('');
        const text = searchText;
        let prop = '';
        let searchparam = '';

        if (text.includes(':')) {
            const s = text.split(':');
            prop = s[0];
            searchparam = s[1];
        }
        else {
            searchparam = text;
        }

        let selected = cyInstance.$(':selected');
        selected.unselect();

        let eles: Array<cytoscape.CollectionReturnValue> = [];
        if (prop) {
            eles[0] = searchGraph(cyInstance, prop, searchparam);
            selected = eles[0];
        }

        selectedProperties?.forEach(prop => {
            eles = eles.concat(searchGraph(cyInstance, prop.name, searchparam));
        });

        if (eles.length) {
            eles.forEach((ele) => {
                if (ele.isEdge()) {
                    selected = selected.add(ele.sources());
                    selected = selected.add(ele.targets());
                }
                selected = selected.add(ele);
            });
            selected.select();

            setSearchStatus(`Found ${selected.length} element${selected.length !== 1 ? 's' : ''}`);
            cyInstance.animate({
                fit: {
                    eles: cyInstance.elements(),
                    padding: 50,
                },
                step: () => undefined,
                duration: 1000,
            });
            cyInstance.animate({
                fit: {
                    eles: selected,
                    padding: 50,
                },
                step: () => undefined,
                duration: 1000,
            });
        } else {
            setSearchStatus('Found 0 elements');
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={`flex flex-col bg-neutralc-200 dark:bg-neutralc-950 pt-3 pb-2 px-4 rounded-lg w-max h-max z-10 min-w-[400px]`}>
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <span className='flex items-center gap-2'>
                    <Icon path={mdiLayersSearchOutline} size={1} />
                    <h1 className='text-lg font-semibold'>Find Nodes/Edges</h1>
                </span>
                <ButtonIcon
                    buttonIcon={mdiClose}
                    type={'btn-ghost'}
                    buttonSize='btn-xs'
                    onClick={onCloseSearch}
                />
            </div>
            {/* Property Selection */}
            <div className={`flex items-center mt-3 h-min min-h-min`}>
                <FormSTIXPropertySelection
                    label={'Select Properties to Search'}
                    propertyOptions={filterOptions}
                    selectedProperties={selectedProperties}
                    setSelectedProperties={setSelectedProperties}
                    size={'standard'}
                />
            </div>
            <div className={`flex items-center h-min min-h-min overflow-hidden`}>
                {selectedProperties.slice(-3).map((filter, index) => (
                    <div key={index} className="badge badge-sm badge-secondary gap-2 mr-1 mt-2">
                        {filter.name}
                        <button onClick={() => removeFilter(filter)} className="text-xs">x</button>
                    </div>
                ))}
                {selectedProperties.length > 3 && (
                    <div className="badge badge-sm badge-secondary gap-2 whitespace-nowrap mr-1 mt-2">
                        <span>+{selectedProperties.length - 3} more</span>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-neutralc-300 dark:border-neutralc-700 my-5" />

            {/* Search Input */}
            <div className={`flex items-center justify-between gap-4 h-min min-h-min`}>
                <input
                    type="text"
                    placeholder="Enter Search Term"
                    className="flex-1 input input-bordered input-sm  dark:bg-neutralc-950"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyUp={handleKeyUp}
                />
            </div>

            {/* Buttons */}
            <div className={`my-2 flex items-center justify-between gap-4 text-xs dark:text-success-light text-success-dark`}>
                <ButtonBasic
                    type={'btn-neutralc'}
                    additionalClasses={'btn-sm'}
                    onClick={handleReset}
                    tooltip={'Reset Search Criteria'}
                    label={<span className='flex items-center gap-1'><Icon path={mdiRefresh} size={1} /> Reset </span>}
                />
                <ButtonBasic
                    type={'btn-primary'}
                    additionalClasses={'btn-sm'}
                    onClick={handleSearch}
                    tooltip={'Find Nodes and Edges'}
                    label={<span className='flex items-center gap-1'><Icon path={mdiMagnify} size={1} /> Search </span>}
                />
            </div>

            {/* Status Message */}
            {searchStatus &&
                <AlertComponent alertText={searchStatus || ''} alertType={'info'} userClosable={true} onClose={() => setSearchStatus('')} className={'mx-0 !mt-4 mb-2 py-2 px-3 text-sm'}></AlertComponent>
            }
        </div>
    );
};

export default SearchComponent;

