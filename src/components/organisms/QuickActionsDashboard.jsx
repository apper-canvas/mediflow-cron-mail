import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickActionCard = ({ label, icon, path, color, onClick }) => {
    return (
        <Button
            onClick={onClick}
            className={`${color} text-white p-4 rounded-lg text-center hover:opacity-90 transition-all flex flex-col items-center justify-center`}
        >
            <ApperIcon name={icon} className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">{label}</span>
        </Button>
    );
};

QuickActionCard.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

const QuickActionsDashboard = () => {
    const navigate = useNavigate();

    const actions = [
        { label: 'New Patient', icon: 'UserPlus', path: '/patients', color: 'bg-primary' },
        { label: 'Book Appointment', icon: 'Calendar', path: '/appointments', color: 'bg-info' },
        { label: 'Add Doctor', icon: 'UserCheck', path: '/doctors', color: 'bg-success' },
        { label: 'Create Bill', icon: 'Receipt', path: '/billing', color: 'bg-warning' }
    ];

    return (
        <Card animate initial={{ opacity: 0, x: 20 }} animateProps={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Heading level={3} className="text-lg font-semibold text-surface-900 mb-6">Quick Actions</Heading>

            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, i) => (
                    <QuickActionCard
                        key={action.label}
                        label={action.label}
                        icon={action.icon}
                        path={action.path}
                        color={action.color}
                        onClick={() => navigate(action.path)}
                        animate
                        initial={{ opacity: 0, scale: 0.9 }}
                        animateProps={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        whileHover={{ scale: 1.05, translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                    />
                ))}
            </div>
        </Card>
    );
};

export default QuickActionsDashboard;