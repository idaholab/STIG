
import React, { useState, useEffect, useCallback } from 'react';
type FilterOption = {
    name: string;
    values: string[];
}

type Filter = {
    name: string;
    value: string;
}

type SearchComponentProps = {
    data: any[]; // replace 'any' with specific data type
    filterOptions?: FilterOption[];
    onFilter: (filteredData: any[]) => void;  // replace 'any' with specific data type
}

const SearchComponent: React.FC<SearchComponentProps> = ({ data, filterOptions, onFilter }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
    const [filteredData, setFilteredData] = useState(data);

    // Function to handle adding a filter
    const addFilter = useCallback((filter: Filter) => {
        if (!activeFilters.includes(filter)) {
            setActiveFilters([...activeFilters, filter]);
        }
    }, [activeFilters]);

    // Function to handle removing a filter
    const removeFilter = useCallback((filterToRemove: Filter) => {
        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    }, [activeFilters]);

    // Function to filter data
    useEffect(() => {
        let results = data;

        if (searchText) {
            const searchTerm = searchText.toLowerCase();
            results = results.filter(item => {
                return Object.values(item).some(value => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchTerm)
                    }
                    return false
                });
            });
        }

        if (activeFilters.length > 0) {
            results = results.filter(item => {
                return activeFilters.every(filter => {
                    if (item[filter.name]) {
                        return String(item[filter.name]).toLowerCase().includes(filter.value.toLowerCase())
                    }
                    return false
                });
            });
        }
        setFilteredData(results);
    }, [data, searchText, activeFilters, setFilteredData]);


    // Function to send the filtered data to the parent component
    useEffect(() => {
        onFilter(filteredData);
    }, [filteredData, onFilter]);

    return (
        <div className="flex items-center bg-neutralc-200 dark:bg-neutralc-950 py-2 px-3 rounded-lg w-max">
            <span className='mr-4'>Find</span>
            {/* Search Input */}
            <div className="flex-1 mr-2">
                <input
                    type="text"
                    placeholder="Search Item"
                    className="input input-bordered input-sm w-full max-w-xs"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* Filters Section */}
            <div className="flex items-center mr-2">
                <span className="text-sm font-medium mr-2">Filters</span>
                <div className="flex items-center space-x-1">
                    {activeFilters.map((filter, index) => (
                        <div key={index} className="badge badge-sm badge-secondary gap-1">
                            {filter.name} : {filter.value}
                            <button onClick={() => removeFilter(filter)} className="text-xs">x</button>
                        </div>
                    ))}
                    {filterOptions && filterOptions.map((option, index) => (
                        <div key={index} className="dropdown dropdown-hover dropdown-bottom">
                            <label tabIndex={0} className="btn btn-xs btn-outline btn-secondary">
                                Add {option.name}
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {option.values.map((value, i) => (
                                    <li key={i}>
                                        <button onClick={() => addFilter({ name: option.name, value: value })}>
                                            {value}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchComponent;

