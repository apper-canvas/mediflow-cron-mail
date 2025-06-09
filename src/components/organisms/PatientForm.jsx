import React from 'react';
import PropTypes from 'prop-types';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const PatientForm = ({
    formData,
    handleInputChange,
    medicalHistoryInput,
    setMedicalHistoryInput,
    handleSubmit,
    resetForm,
    editingPatient,
}) => {
    const genderOptions = [
        { value: '', label: 'Select gender' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    const bloodGroupOptions = [
        { value: '', label: 'Select blood group' },
        { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
    ];

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

                <FormField label="Date of Birth">
                    <Input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                    />
                </FormField>

                <FormField label="Gender">
                    <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        options={genderOptions}
                    />
                </FormField>

                <FormField label="Blood Group">
                    <Select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        options={bloodGroupOptions}
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
            </div>

            <FormField label="Address">
                <TextArea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                />
            </FormField>

            <FormField label="Medical History">
                <TextArea
                    value={medicalHistoryInput}
                    onChange={(e) => setMedicalHistoryInput(e.target.value)}
                    placeholder="Enter medical conditions separated by commas..."
                    rows={3}
                />
                <Text as="p" className="text-xs text-surface-600 mt-1">
                    Separate multiple conditions with commas
                </Text>
            </FormField>

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
                    {editingPatient ? 'Update' : 'Add'} Patient
                </Button>
            </div>
        </form>
    );
};

PatientForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    medicalHistoryInput: PropTypes.string.isRequired,
    setMedicalHistoryInput: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    editingPatient: PropTypes.object,
};

export default PatientForm;