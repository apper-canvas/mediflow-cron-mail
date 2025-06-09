import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ className, ...rest }) => {
    return (
        <input
            type="checkbox"
            className={`rounded border-surface-300 text-primary focus:ring-primary ${className}`}
            {...rest}
        />
    );
};

Checkbox.propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
};

export default Checkbox;