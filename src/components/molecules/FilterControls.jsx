import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/molecules/Card';

const FilterControls = ({ searchTerm, onSearchChange, filterValue, onFilterChange, filterOptions, placeholder = "Search...", className }) => {
    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4"
                        />
                    </div>
                </div>
                {filterOptions && (
                    <Select
                        value={filterValue}
                        onChange={(e) => onFilterChange(e.target.value)}
                        options={filterOptions}
                    />
                )}
            </div>
        </Card>
    );
};

FilterControls.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    filterValue: PropTypes.string,
    onFilterChange: PropTypes.func,
    filterOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default FilterControls;