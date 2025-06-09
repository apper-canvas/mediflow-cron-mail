import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({ children, className, animate = false, initial = {}, animateProps = {}, transition = {}, ...rest }) => {
    const baseClasses = "bg-white rounded-lg shadow-sm p-6";
    const hoverClasses = "hover:shadow-md transition-shadow";

    const combinedClassName = `${baseClasses} ${hoverClasses} ${className || ''}`.trim();

    if (animate) {
        return (
            <motion.div
                initial={initial}
                animate={animateProps}
                transition={transition}
                className={combinedClassName}
                {...rest}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={combinedClassName} {...rest}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    animate: PropTypes.bool,
    initial: PropTypes.object,
    animateProps: PropTypes.object,
    transition: PropTypes.object,
};

export default Card;