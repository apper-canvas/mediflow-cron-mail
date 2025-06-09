import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const DoctorCard = ({ doctor, onEdit, onDelete, onToggleStatus }) => (
    <Card
        animate={true}
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="UserCheck" className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                    <Heading level={3} className="font-semibold text-surface-900 truncate">Dr. {doctor.name}</Heading>
                    <Text as="p" className="text-sm text-surface-600">{doctor.specialization}</Text>
                </div>
            </div>
            <div className="flex items-center space-x-1">
                <Button
                    onClick={() => onToggleStatus(doctor)}
                    className={`p-1 rounded transition-colors ${
                        doctor.status === 'active'
                            ? 'text-success hover:text-success/80'
                            : 'text-surface-400 hover:text-surface-600'
                    }`}
                    title={doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                    <ApperIcon name={doctor.status === 'active' ? 'CheckCircle' : 'XCircle'} className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onEdit(doctor)}
                    className="p-1 text-surface-600 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onDelete(doctor.id)}
                    className="p-1 text-surface-600 hover:text-error transition-colors"
                    title="Delete"
                >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
            </div>
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                <Text as="span" className="text-sm text-surface-600 truncate">{doctor.email}</Text>
            </div>
            <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" className="w-4 h-4 text-surface-400" />
                <Text as="span" className="text-sm text-surface-600">{doctor.phone}</Text>
            </div>
            {doctor.department && (
                <div className="flex items-center space-x-2">
                    <ApperIcon name="Building" className="w-4 h-4 text-surface-400" />
                    <Text as="span" className="text-sm text-surface-600">{doctor.department}</Text>
                </div>
            )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-surface-200">
            <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${
                doctor.status === 'active'
                    ? 'bg-success/10 text-success'
                    : 'bg-surface-100 text-surface-600'
            }`}>
                {doctor.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
            <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                <Text as="span" className="text-xs text-surface-600">
                    {doctor.availability?.length || 0} days available
                </Text>
            </div>
        </div>
    </Card>
);

DoctorCard.propTypes = {
    doctor: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleStatus: PropTypes.func.isRequired,
};

const DoctorCardsDisplay = ({ doctors, searchTerm, specializationFilter, onEdit, onDelete, onToggleStatus, setShowForm }) => {
    return (
        <Card>
            {doctors.length === 0 ? (
                <EmptyState
                    icon="UserCheck"
                    title={searchTerm || specializationFilter !== 'all' ? 'No doctors found' : 'No doctors added'}
                    message={searchTerm || specializationFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add your first doctor to get started'}
                    buttonText="Add Doctor"
                    onButtonClick={() => setShowForm(true)}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {doctors.map((doctor, i) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

DoctorCardsDisplay.propTypes = {
    doctors: PropTypes.array.isRequired,
    searchTerm: PropTypes.string.isRequired,
    specializationFilter: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleStatus: PropTypes.func.isRequired,
    setShowForm: PropTypes.func.isRequired,
};

export default DoctorCardsDisplay;