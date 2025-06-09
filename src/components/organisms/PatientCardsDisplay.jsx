import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const PatientCard = ({ patient, calculateAge, onEdit, onDelete }) => (
    <Card
        animate={true}
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                    <Heading level={3} className="font-semibold text-surface-900 truncate">{patient.name}</Heading>
                    <Text as="p" className="text-sm text-surface-600">
                        {patient.dateOfBirth && `Age ${calculateAge(patient.dateOfBirth)}`}
                        {patient.gender && ` • ${patient.gender}`}
                    </Text>
                </div>
            </div>
            <div className="flex space-x-1">
                <Button
                    onClick={() => onEdit(patient)}
                    className="p-1 text-surface-600 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onDelete(patient.id)}
                    className="p-1 text-surface-600 hover:text-error transition-colors"
                    title="Delete"
                >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
            </div>
        </div>

        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                <Text as="span" className="text-sm text-surface-600 truncate">{patient.email}</Text>
            </div>
            <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" className="w-4 h-4 text-surface-400" />
                <Text as="span" className="text-sm text-surface-600">{patient.phone}</Text>
            </div>
            {patient.bloodGroup && (
                <div className="flex items-center space-x-2">
                    <ApperIcon name="Droplet" className="w-4 h-4 text-surface-400" />
                    <Text as="span" className="text-sm text-surface-600">{patient.bloodGroup}</Text>
                </div>
            )}
        </div>

        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
            <div className="mt-4">
                <Text as="p" className="text-xs font-medium text-surface-700 mb-2">Medical History:</Text>
                <div className="flex flex-wrap gap-1">
                    {patient.medicalHistory.slice(0, 3).map((condition, index) => (
                        <Text
                            key={index}
                            as="span"
                            className="px-2 py-1 bg-surface-100 text-surface-700 rounded text-xs"
                        >
                            {condition}
                        </Text>
                    ))}
                    {patient.medicalHistory.length > 3 && (
                        <Text as="span" className="px-2 py-1 bg-surface-100 text-surface-700 rounded text-xs">
                            +{patient.medicalHistory.length - 3} more
                        </Text>
                    )}
                </div>
            </div>
        )}

        <div className="mt-4 pt-4 border-t border-surface-200">
            <Text as="p" className="text-xs text-surface-500">
                Patient ID: {patient.id}
            </Text>
        </div>
    </Card>
);

PatientCard.propTypes = {
    patient: PropTypes.object.isRequired,
    calculateAge: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const PatientCardsDisplay = ({ patients, searchTerm, setShowForm, calculateAge, handleEdit, handleDelete }) => {
    return (
        <Card>
            {patients.length === 0 ? (
                <EmptyState
                    icon="Users"
                    title={searchTerm ? 'No patients found' : 'No patients registered'}
                    message={searchTerm ? 'Try adjusting your search terms' : 'Add your first patient to get started'}
                    buttonText="Add Patient"
                    onButtonClick={() => setShowForm(true)}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {patients.map((patient, i) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            calculateAge={calculateAge}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

PatientCardsDisplay.propTypes = {
    patients: PropTypes.array.isRequired,
    searchTerm: PropTypes.string.isRequired,
    setShowForm: PropTypes.func.isRequired,
    calculateAge: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default PatientCardsDisplay;