import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ htmlFor, children, className, ...rest }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-surface-700 mb-2 ${className}`}
            {...rest}
        >
            {children}
        </label>
    );
};

Label.propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Label;