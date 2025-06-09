import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ListItem = ({ children, onClick, className, animate = false, delay = 0, ...rest }) => {
    const baseClasses = "flex items-center space-x-4 p-3 rounded-lg transition-colors";
    const clickableClasses = onClick ? "hover:bg-surface-50 cursor-pointer" : "";

    const combinedClassName = `${baseClasses} ${clickableClasses} ${className || ''}`.trim();

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
                className={combinedClassName}
                onClick={onClick}
                {...rest}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={combinedClassName} onClick={onClick} {...rest}>
            {children}
        </div>
    );
};

ListItem.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    animate: PropTypes.bool,
    delay: PropTypes.number,
};

export default ListItem;