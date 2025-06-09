import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ children, className, as = 'p', ...rest }) => {
    const Component = as;
    return (
        <Component className={className} {...rest}>
            {children}
        </Component>
    );
};

Text.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    as: PropTypes.oneOf(['p', 'span', 'div']),
};

export default Text;