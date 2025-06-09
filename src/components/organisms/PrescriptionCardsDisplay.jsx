import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const PrescriptionCard = ({ prescription, patientMap, doctorMap, onPrint, onEdit, onDelete }) => (
    <Card
        animate={true}
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                    <Heading level={3} className="font-semibold text-surface-900 truncate">
                        {patientMap[prescription.patientId]?.name || `Patient #${prescription.patientId}`}
                    </Heading>
                    <Text as="p" className="text-sm text-surface-600">
                        by {doctorMap[prescription.doctorId]?.name ? `Dr. ${doctorMap[prescription.doctorId].name}` : `Doctor #${prescription.doctorId}`}
                    </Text>
                </div>
            </div>
            <div className="flex space-x-1">
                <Button
                    onClick={() => onPrint(prescription)}
                    className="p-1 text-surface-600 hover:text-primary transition-colors"
                    title="Print Prescription"
                >
                    <ApperIcon name="Printer" className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onEdit(prescription)}
                    className="p-1 text-surface-600 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => onDelete(prescription.id)}
                    className="p-1 text-surface-600 hover:text-error transition-colors"
                    title="Delete"
                >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
            </div>
        </div>

        <div className="space-y-3">
            <div>
                <Text as="p" className="text-sm font-medium text-surface-700">Diagnosis:</Text>
                <Text as="p" className="text-sm text-surface-900">{prescription.diagnosis}</Text>
            </div>

            <div>
                <Text as="p" className="text-sm font-medium text-surface-700 mb-2">Medications:</Text>
                <div className="space-y-2">
                    {prescription.medications.map((medication, index) => (
                        <div key={index} className="bg-surface-50 p-3 rounded-lg">
                            <Text as="p" className="font-medium text-surface-900">{medication.name}</Text>
                            <Text as="p" className="text-sm text-surface-600">
                                {medication.dosage} • {medication.duration}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                    <Text as="span" className="text-sm text-surface-600">{prescription.date}</Text>
                </div>
                <Text as="span" className="text-xs text-surface-500">
                    ID: {prescription.id.slice(-6)}
                </Text>
            </div>
        </div>
    </Card>
);

PrescriptionCard.propTypes = {
    prescription: PropTypes.object.isRequired,
    patientMap: PropTypes.object.isRequired,
    doctorMap: PropTypes.object.isRequired,
    onPrint: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const PrescriptionCardsDisplay = ({ prescriptions, searchTerm, setShowForm, patientMap, doctorMap, handlePrint, handleEdit, handleDelete }) => {
    return (
        <Card>
            {prescriptions.length === 0 ? (
                <EmptyState
                    icon="FileText"
                    title={searchTerm ? 'No prescriptions found' : 'No prescriptions created'}
                    message={searchTerm ? 'Try adjusting your search terms' : 'Create your first prescription to get started'}
                    buttonText="Create Prescription"
                    onButtonClick={() => setShowForm(true)}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {prescriptions.map((prescription, i) => (
                        <PrescriptionCard
                            key={prescription.id}
                            prescription={prescription}
                            patientMap={patientMap}
                            doctorMap={doctorMap}
                            onPrint={handlePrint}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

PrescriptionCardsDisplay.propTypes = {
    prescriptions: PropTypes.array.isRequired,
    searchTerm: PropTypes.string.isRequired,
    setShowForm: PropTypes.func.isRequired,
    patientMap: PropTypes.object.isRequired,
    doctorMap: PropTypes.object.isRequired,
    handlePrint: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default PrescriptionCardsDisplay;