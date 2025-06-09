import React from 'react';
import PropTypes from 'prop-types';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const DashboardHeader = ({ title, description, actions }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <Heading level={1} className="text-2xl font-bold text-surface-900">{title}</Heading>
                <Text as="p" className="text-surface-600 mt-1">{description}</Text>
            </div>
            {actions && actions.length > 0 && (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    {actions.map((action, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: action.hoverScale || 1.05 }}
                            whileTap={{ scale: action.tapScale || 0.95 }}
                        >
                            <Button
                                onClick={action.onClick}
                                className={action.className}
                            >
                                {action.icon && <ApperIcon name={action.icon} className="w-4 h-4 inline mr-2" />}
                                {action.label}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

DashboardHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string,
        icon: PropTypes.string,
        hoverScale: PropTypes.number,
        tapScale: PropTypes.number,
    })),
};

export default DashboardHeader;