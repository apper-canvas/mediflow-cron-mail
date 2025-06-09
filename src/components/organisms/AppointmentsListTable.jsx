import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const AppointmentsListTable = ({
    appointments,
    patientMap,
    doctorMap,
    getStatusColor,
    handleEdit,
    handleDelete,
    handleStatusChange,
    searchTerm,
    statusFilter,
    setShowForm
}) => {
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <Card>
            {appointments.length === 0 ? (
                <EmptyState
                    icon="Calendar"
                    title="No appointments found"
                    message={searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first appointment to get started'}
                    buttonText="New Appointment"
                    onButtonClick={() => setShowForm(true)}
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-surface-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Patient</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Doctor</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Date & Time</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Type</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Status</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, i) => (
                                <motion.tr
                                    key={appointment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <div>
                                            <Text as="p" className="font-medium text-surface-900">
                                                {patientMap[appointment.patientId]?.name || `Patient #${appointment.patientId}`}
                                            </Text>
                                            <Text as="p" className="text-sm text-surface-600">ID: {appointment.patientId}</Text>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <Text as="p" className="font-medium text-surface-900">
                                                {doctorMap[appointment.doctorId]?.name ? `Dr. ${doctorMap[appointment.doctorId].name}` : `Doctor #${appointment.doctorId}`}
                                            </Text>
                                            <Text as="p" className="text-sm text-surface-600">
                                                {doctorMap[appointment.doctorId]?.specialization || 'N/A'}
                                            </Text>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <Text as="p" className="font-medium text-surface-900">{appointment.date}</Text>
                                            <Text as="p" className="text-sm text-surface-600">{appointment.time}</Text>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Text as="span" className="px-2 py-1 bg-surface-100 text-surface-700 rounded-full text-xs font-medium capitalize">
                                            {appointment.type}
                                        </Text>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Select
                                            value={appointment.status}
                                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                            options={statusOptions}
                                            className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${getStatusColor(appointment.status)}`}
                                        />
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => handleEdit(appointment)}
                                                className="p-1 text-surface-600 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <ApperIcon name="Edit" className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(appointment.id)}
                                                className="p-1 text-surface-600 hover:text-error transition-colors"
                                                title="Delete"
                                            >
                                                <ApperIcon name="Trash2" className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};

AppointmentsListTable.propTypes = {
    appointments: PropTypes.array.isRequired,
    patientMap: PropTypes.object.isRequired,
    doctorMap: PropTypes.object.isRequired,
    getStatusColor: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    statusFilter: PropTypes.string.isRequired,
    setShowForm: PropTypes.func.isRequired,
};

export default AppointmentsListTable;