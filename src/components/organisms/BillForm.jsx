import React from 'react';
import PropTypes from 'prop-types';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Label from '@/components/atoms/Label';
import Text from '@/components/atoms/Text';

const BillForm = ({
    formData,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit,
    resetForm,
    patients,
    editingBill,
    totalAmount,
}) => {
    const patientOptions = [{ value: '', label: 'Select a patient' }, ...patients.map(p => ({ value: p.id, label: `${p.name} - ${p.email}` }))];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Patient" required>
                    <Select
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        options={patientOptions}
                        required
                    />
                </FormField>

                <FormField label="Appointment ID (Optional)">
                    <Input
                        type="text"
                        name="appointmentId"
                        value={formData.appointmentId}
                        onChange={handleInputChange}
                        placeholder="Enter appointment ID"
                    />
                </FormField>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <Label>
                        Bill Items <span className="text-error">*</span>
                    </Label>
                    <Button
                        type="button"
                        onClick={addItem}
                        className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                    >
                        <ApperIcon name="Plus" className="w-4 h-4 inline mr-1" />
                        Add Item
                    </Button>
                </div>

                <div className="space-y-3">
                    {formData.items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-end">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-32">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Amount"
                                    value={item.amount || ''}
                                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                    required
                                />
                            </div>
                            {formData.items.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                                >
                                    <ApperIcon name="Trash2" className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-surface-200">
                    <div className="flex justify-between items-center">
                        <Text as="span" className="text-lg font-semibold text-surface-900">Total:</Text>
                        <Text as="span" className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</Text>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {editingBill ? 'Update' : 'Create'} Bill
                </Button>
            </div>
        </form>
    );
};

BillForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleItemChange: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    patients: PropTypes.array.isRequired,
    editingBill: PropTypes.object,
    totalAmount: PropTypes.number.isRequired,
};

export default BillForm;