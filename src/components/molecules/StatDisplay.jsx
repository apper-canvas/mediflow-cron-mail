import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatDisplay = ({ label, value, icon, iconColor, iconBgColor, change, changeColor }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <Text as="p" className="text-surface-600 text-sm mb-1">{label}</Text>
                <Text as="p" className="text-2xl font-bold text-surface-900">{value}</Text>
            </div>
            {icon && (
                <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <ApperIcon name={icon} className={`w-6 h-6 ${iconColor}`} />
                </div>
            )}
            {change && (
                <Text as="span" className={`text-sm font-medium ${changeColor}`}>
                    {change}
                </Text>
            )}
        </div>
    );
};

StatDisplay.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    iconBgColor: PropTypes.string,
    change: PropTypes.string,
    changeColor: PropTypes.string,
};

export default StatDisplay;