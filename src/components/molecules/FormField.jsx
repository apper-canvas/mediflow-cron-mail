import React from 'react';
import PropTypes from 'prop-types';
import Label from '@/components/atoms/Label';

const FormField = ({ label, children, className, required = false, ...rest }) => {
    return (
        <div className={className} {...rest}>
            <Label>
                {label} {required && <span className="text-error">*</span>}
            </Label>
            {children}
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    required: PropTypes.bool,
};

export default FormField;