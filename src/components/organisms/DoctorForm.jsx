import React from 'react';
import PropTypes from 'prop-types';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Checkbox from '@/components/atoms/Checkbox';
import Label from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const DoctorForm = ({
    formData,
    handleInputChange,
    handleAvailabilityChange,
    handleSubmit,
    resetForm,
    editingDoctor,
    specializations,
    departments,
    days,
    timeSlots,
}) => {
    const specializationOptions = [{ value: '', label: 'Select specialization' }, ...specializations.map(s => ({ value: s, label: s }))];
    const departmentOptions = [{ value: '', label: 'Select department' }, ...departments.map(d => ({ value: d, label: d }))];

    const getAvailabilityForDay = (day) => {
        const availability = formData.availability.find(avail => avail.day === day);
        return availability ? availability.slots : [];
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name" required>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </FormField>

                <FormField label="Specialization" required>
                    <Select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        options={specializationOptions}
                        required
                    />
                </FormField>

                <FormField label="Email" required>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </FormField>

                <FormField label="Phone" required>
                    <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </FormField>

                <div className="md:col-span-2">
                    <FormField label="Department">
                        <Select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            options={departmentOptions}
                        />
                    </FormField>
                </div>
            </div>

            <div>
                <Label className="block text-sm font-medium text-surface-700 mb-4">
                    Availability Schedule
                </Label>
                <div className="space-y-4">
                    {days.map(day => (
                        <div key={day} className="border border-surface-200 rounded-lg p-4">
                            <h4 className="font-medium text-surface-900 mb-3">{day}</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {timeSlots.map(slot => (
                                    <label key={slot} className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={getAvailabilityForDay(day).includes(slot)}
                                            onChange={(e) => {
                                                const currentSlots = getAvailabilityForDay(day);
                                                const newSlots = e.target.checked
                                                    ? [...currentSlots, slot]
                                                    : currentSlots.filter(s => s !== slot);
                                                handleAvailabilityChange(day, newSlots);
                                            }}
                                        />
                                        <Text as="span" className="text-sm text-surface-700">{slot}</Text>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
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
                    {editingDoctor ? 'Update' : 'Add'} Doctor
                </Button>
            </div>
        </form>
    );
};

DoctorForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleAvailabilityChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    editingDoctor: PropTypes.object,
    specializations: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    days: PropTypes.array.isRequired,
    timeSlots: PropTypes.array.isRequired,
};

export default DoctorForm;