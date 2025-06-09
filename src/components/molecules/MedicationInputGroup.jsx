import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const MedicationInputGroup = ({ medication, index, onMedicationChange, onRemove, isRemovable }) => {
    return (
        <div className="border border-surface-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-surface-900">Medication {index + 1}</h4>
                {isRemovable && (
                    <Button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                    >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <Label className="text-xs font-medium text-surface-600 mb-1">
                        Medication Name <span className="text-error">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="e.g., Aspirin"
                        value={medication.name}
                        onChange={(e) => onMedicationChange(index, 'name', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label className="text-xs font-medium text-surface-600 mb-1">
                        Dosage <span className="text-error">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="e.g., 100mg twice daily"
                        value={medication.dosage}
                        onChange={(e) => onMedicationChange(index, 'dosage', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label className="text-xs font-medium text-surface-600 mb-1">
                        Duration <span className="text-error">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="e.g., 7 days"
                        value={medication.duration}
                        onChange={(e) => onMedicationChange(index, 'duration', e.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

MedicationInputGroup.propTypes = {
    medication: PropTypes.shape({
        name: PropTypes.string.isRequired,
        dosage: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    onMedicationChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    isRemovable: PropTypes.bool.isRequired,
};

export default MedicationInputGroup;