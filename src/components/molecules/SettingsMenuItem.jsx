import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const SettingsMenuItem = ({ icon, label, isActive, onClick }) => {
    return (
        <Button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-surface-700 hover:bg-surface-100'
            }`}
        >
            <ApperIcon name={icon} className="w-5 h-5" />
            <Text as="span">{label}</Text>
        </Button>
    );
};

SettingsMenuItem.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default SettingsMenuItem;