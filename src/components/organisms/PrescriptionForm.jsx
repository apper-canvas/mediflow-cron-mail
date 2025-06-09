import React from 'react';
import PropTypes from 'prop-types';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Label from '@/components/atoms/Label';
import MedicationInputGroup from '@/components/molecules/MedicationInputGroup';

const PrescriptionForm = ({
    formData,
    handleInputChange,
    handleMedicationChange,
    addMedication,
    removeMedication,
    handleSubmit,
    resetForm,
    patients,
    doctors,
    editingPrescription,
}) => {
    const patientOptions = [{ value: '', label: 'Select a patient' }, ...patients.map(p => ({ value: p.id, label: `${p.name} - ${p.email}` }))];
    const doctorOptions = [{ value: '', label: 'Select a doctor' }, ...doctors.map(d => ({ value: d.id, label: `Dr. ${d.name} - ${d.specialization}` }))];

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

                <FormField label="Doctor" required>
                    <Select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleInputChange}
                        options={doctorOptions}
                        required
                    />
                </FormField>

                <div className="md:col-span-2">
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
            </div>

            <FormField label="Diagnosis" required>
                <TextArea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Enter diagnosis..."
                />
            </FormField>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <Label>
                        Medications <span className="text-error">*</span>
                    </Label>
                    <Button
                        type="button"
                        onClick={addMedication}
                        className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                    >
                        <ApperIcon name="Plus" className="w-4 h-4 inline mr-1" />
                        Add Medication
                    </Button>
                </div>

                <div className="space-y-4">
                    {formData.medications.map((medication, index) => (
                        <MedicationInputGroup
                            key={index}
                            medication={medication}
                            index={index}
                            onMedicationChange={handleMedicationChange}
                            onRemove={removeMedication}
                            isRemovable={formData.medications.length > 1}
                        />
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
                    {editingPrescription ? 'Update' : 'Create'} Prescription
                </Button>
            </div>
        </form>
    );
};

PrescriptionForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleMedicationChange: PropTypes.func.isRequired,
    addMedication: PropTypes.func.isRequired,
    removeMedication: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    patients: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
    editingPrescription: PropTypes.object,
};

export default PrescriptionForm;