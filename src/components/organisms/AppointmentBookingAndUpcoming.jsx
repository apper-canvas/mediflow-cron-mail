import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { appointmentService } from '@/services';
import Card from '@/components/molecules/Card';
import TabButton from '@/components/molecules/TabButton';
import Heading from '@/components/atoms/Heading';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import EmptyState from '@/components/molecules/EmptyState';
import ListItem from '@/components/molecules/ListItem';
import Text from '@/components/atoms/Text';

const AppointmentBookingAndUpcoming = ({ patients, doctors, patientMap, doctorMap }) => {
    const [activeTab, setActiveTab] = useState('book');
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        type: 'consultation',
        notes: ''
    });

    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    const appointmentTypes = [
        { value: 'consultation', label: 'Consultation' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'routine', label: 'Routine Check-up' },
    ];

    useEffect(() => {
        if (activeTab === 'upcoming') {
            fetchAppointments();
        }
    }, [activeTab]);

    const fetchAppointments = async () => {
        setLoadingAppointments(true);
        try {
            const data = await appointmentService.getAll();
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to load upcoming appointments');
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const newAppointment = {
                ...formData,
                status: 'scheduled',
                duration: 30
            };

            await appointmentService.create(newAppointment);
            toast.success('Appointment booked successfully');
            setFormData({
                patientId: '',
                doctorId: '',
                date: '',
                time: '',
                type: 'consultation',
                notes: ''
            });
            fetchAppointments(); // Refresh upcoming appointments
        } catch (error) {
            toast.error('Failed to book appointment');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-info text-white';
            case 'completed': return 'bg-success text-white';
            case 'cancelled': return 'bg-error text-white';
            default: return 'bg-surface-300 text-surface-700';
        }
    };

    const upcomingAppointments = appointments
        .filter(apt => {
            const today = new Date();
            const aptDate = new Date(apt.date);
            return aptDate >= today && apt.status === 'scheduled';
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    const patientOptions = [{ value: '', label: 'Select a patient' }, ...patients.map(p => ({ value: p.id, label: `${p.name} - ${p.email}` }))];
    const doctorOptions = [{ value: '', label: 'Select a doctor' }, ...doctors.map(d => ({ value: d.id, label: `Dr. ${d.name} - ${d.specialization}` }))];
    const timeOptions = [{ value: '', label: 'Select time' }, ...timeSlots.map(t => ({ value: t, label: t }))];

    return (
        <div className="space-y-6 max-w-full overflow-hidden">
            <Card className="p-1">
                <div className="flex space-x-1">
                    <TabButton
                        isActive={activeTab === 'book'}
                        onClick={() => setActiveTab('book')}
                        icon="Plus"
                        label="Book Appointment"
                    />
                    <TabButton
                        isActive={activeTab === 'upcoming'}
                        onClick={() => setActiveTab('upcoming')}
                        icon="Calendar"
                        label="Upcoming"
                    />
                </div>
            </Card>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'book' && (
                    <Card>
                        <Heading level={2} className="text-lg font-semibold text-surface-900 mb-6">Book New Appointment</Heading>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        options={appointmentTypes}
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

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <ApperIcon name="Calendar" className="w-4 h-4 inline mr-2" />
                                    Book Appointment
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {activeTab === 'upcoming' && (
                    <Card>
                        <Heading level={2} className="text-lg font-semibold text-surface-900 mb-6">Upcoming Appointments</Heading>

                        {loadingAppointments ? (
                            <div className="space-y-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-surface-200 rounded-lg h-24 animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            upcomingAppointments.length === 0 ? (
                                <EmptyState
                                    icon="Calendar"
                                    title="No upcoming appointments"
                                    message="Book your first appointment to get started"
                                    buttonText="Book Appointment"
                                    onButtonClick={() => setActiveTab('book')}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment, i) => (
                                        <ListItem
                                            key={appointment.id}
                                            animate
                                            delay={i * 0.1}
                                            className="border border-surface-200"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <Text as="p" className="font-medium text-surface-900">
                                                        {patientMap[appointment.patientId]?.name || `Patient #${appointment.patientId}`}
                                                    </Text>
                                                    <Text as="p" className="text-sm text-surface-600">
                                                        {doctorMap[appointment.doctorId]?.name ? `Dr. ${doctorMap[appointment.doctorId].name}` : `Doctor #${appointment.doctorId}`}
                                                    </Text>
                                                    <Text as="p" className="text-sm text-surface-600">
                                                        {appointment.date} at {appointment.time}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status}
                                                </Text>
                                                <Text as="span" className="px-2 py-1 bg-surface-100 text-surface-700 rounded-full text-xs font-medium">
                                                    {appointment.type}
                                                </Text>
                                            </div>
                                        </ListItem>
                                    ))}
                                </div>
                            )
                        )}
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

AppointmentBookingAndUpcoming.propTypes = {
    patients: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
    patientMap: PropTypes.object.isRequired,
    doctorMap: PropTypes.object.isRequired,
};

export default AppointmentBookingAndUpcoming;