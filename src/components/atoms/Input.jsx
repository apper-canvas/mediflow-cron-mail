import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className, ...rest }) => {
    return (
        <input
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            {...rest}
        />
    );
};

Input.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    min: PropTypes.string,
    step: PropTypes.string,
};

export default Input;