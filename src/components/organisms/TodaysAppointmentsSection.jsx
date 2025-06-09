import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import ListItem from '@/components/molecules/ListItem';
import Text from '@/components/atoms/Text';

const TodaysAppointmentsSection = ({ appointments, patientMap, doctorMap, getStatusColor }) => {
    const navigate = useNavigate();

    return (
        <Card animate initial={{ opacity: 0, x: -20 }} animateProps={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
                <Heading level={2} className="text-lg font-semibold text-surface-900">Today's Appointments</Heading>
                <Button
                    onClick={() => navigate('/appointments')}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                    View all
                </Button>
            </div>

            {appointments.length === 0 ? (
                <EmptyState
                    icon="Calendar"
                    title="No upcoming appointments"
                    message="No appointments scheduled for today"
                    buttonText="Book Appointment"
                    onButtonClick={() => navigate('/appointments')}
                />
            ) : (
                <div className="space-y-3">
                    {appointments.slice(0, 3).map((appointment, i) => (
                        <ListItem
                            key={appointment.id}
                            animate
                            delay={0.3 + i * 0.1}
                            className="bg-surface-50"
                            onClick={() => navigate('/appointments')}
                        >
                            <div className="min-w-0 flex-1">
                                <Text as="p" className="font-medium text-surface-900 truncate">
                                    {patientMap[appointment.patientId]?.name || `Patient #${appointment.patientId}`}
                                </Text>
                                <Text as="p" className="text-surface-600 text-sm">
                                    {doctorMap[appointment.doctorId]?.name ? `Dr. ${doctorMap[appointment.doctorId].name}` : `Doctor #${appointment.doctorId}`} • {appointment.time}
                                </Text>
                            </div>
                            <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                            </Text>
                        </ListItem>
                    ))}
                </div>
            )}
        </Card>
    );
};

TodaysAppointmentsSection.propTypes = {
    appointments: PropTypes.array.isRequired,
    patientMap: PropTypes.object.isRequired,
    doctorMap: PropTypes.object.isRequired,
    getStatusColor: PropTypes.func.isRequired,
};

export default TodaysAppointmentsSection;