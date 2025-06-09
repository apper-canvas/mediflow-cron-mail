import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import ListItem from '@/components/molecules/ListItem';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const RecentPatientsSection = ({ patients }) => {
    const navigate = useNavigate();

    return (
        <Card animate initial={{ opacity: 0, x: 20 }} animateProps={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
                <Heading level={2} className="text-lg font-semibold text-surface-900">Recent Patients</Heading>
                <Button
                    onClick={() => navigate('/patients')}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                    View all
                </Button>
            </div>

            {patients.length === 0 ? (
                <EmptyState
                    icon="Users"
                    title="No patients registered yet"
                    message="Add your first patient to get started"
                    buttonText="Add Patient"
                    onButtonClick={() => navigate('/patients')}
                />
            ) : (
                <div className="space-y-3">
                    {patients.map((patient, i) => (
                        <ListItem
                            key={patient.id}
                            animate
                            delay={0.4 + i * 0.1}
                            className="bg-surface-50 hover:bg-surface-100"
                            onClick={() => navigate('/patients')}
                        >
                            <div className="min-w-0 flex-1">
                                <Text as="p" className="font-medium text-surface-900 truncate">{patient.name}</Text>
                                <Text as="p" className="text-surface-600 text-sm">
                                    {patient.email} • {patient.bloodGroup}
                                </Text>
                            </div>
                            <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
                        </ListItem>
                    ))}
                </div>
            )}
        </Card>
    );
};

RecentPatientsSection.propTypes = {
    patients: PropTypes.array.isRequired,
};

export default RecentPatientsSection;