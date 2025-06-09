import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@/components/atoms/Checkbox';

const ToggleSwitch = ({ checked, onChange, label, description }) => {
    return (
        <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
            <div>
                <h4 className="font-medium text-surface-900">{label}</h4>
                <p className="text-sm text-surface-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    );
};

ToggleSwitch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default ToggleSwitch;