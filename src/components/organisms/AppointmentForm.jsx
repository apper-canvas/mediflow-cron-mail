import React from 'react';
import PropTypes from 'prop-types';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';

const AppointmentForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    patients,
    doctors,
    editingAppointment,
}) => {
    const patientOptions = [{ value: '', label: 'Select a patient' }, ...patients.map(p => ({ value: p.id, label: `${p.name} - ${p.email}` }))];
    const doctorOptions = [{ value: '', label: 'Select a doctor' }, ...doctors.map(d => ({ value: d.id, label: `Dr. ${d.name} - ${d.specialization}` }))];
    const timeOptions = [{ value: '', label: 'Select time' }, ...['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map(t => ({ value: t, label: t }))];
    const typeOptions = [
        { value: 'consultation', label: 'Consultation' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'routine', label: 'Routine Check-up' },
    ];

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

                <FormField label="Date" required>
                    <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </FormField>

                <FormField label="Time" required>
                    <Select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        options={timeOptions}
                        required
                    />
                </FormField>

                <FormField label="Appointment Type">
                    <Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        options={typeOptions}
                    />
                </FormField>
            </div>

            <FormField label="Notes">
                <TextArea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Additional notes for the appointment..."
                />
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
                    {editingAppointment ? 'Update' : 'Create'} Appointment
                </Button>
            </div>
        </form>
    );
};

AppointmentForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    patients: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
    editingAppointment: PropTypes.object,
};

export default AppointmentForm;