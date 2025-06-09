import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className, type = 'button', ...rest }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            {...rest}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;