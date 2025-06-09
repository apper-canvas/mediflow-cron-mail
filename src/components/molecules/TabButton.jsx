import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TabButton = ({ isActive, onClick, icon, label, className, ...rest }) => {
    const activeClasses = 'bg-white text-surface-900 shadow-sm';
    const inactiveClasses = 'text-surface-600 hover:text-surface-900 hover:bg-surface-50';

    return (
        <Button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses} ${className || ''}`}
            {...rest}
        >
            {icon && <ApperIcon name={icon} className="w-4 h-4" />}
            <span>{label}</span>
        </Button>
    );
};

TabButton.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default TabButton;