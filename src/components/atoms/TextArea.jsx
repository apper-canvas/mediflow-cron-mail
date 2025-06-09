import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({ className, ...rest }) => {
    return (
        <textarea
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${className}`}
            {...rest}
        />
    );
};

TextArea.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    required: PropTypes.bool,
};

export default TextArea;