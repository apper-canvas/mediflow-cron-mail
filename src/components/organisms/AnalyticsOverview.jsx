import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import StatDisplay from '@/components/molecules/StatDisplay';

const AnalyticsOverview = ({ stats }) => {
    const statData = [
        {
            label: 'Total Patients',
            value: stats.totalPatients,
            icon: 'Users',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            change: '+12%',
            changeColor: 'text-success'
        },
        {
            label: 'Active Doctors',
            value: stats.activeDoctorCount,
            icon: 'UserCheck',
            color: 'text-success',
            bgColor: 'bg-success/10',
            change: '+3%',
            changeColor: 'text-success'
        },
        {
            label: "Today's Appointments",
            value: stats.todayAppointments,
            icon: 'Calendar',
            color: 'text-info',
            bgColor: 'bg-info/10',
            change: '+8%',
            changeColor: 'text-success'
        },
        {
            label: 'Pending Bills',
            value: stats.pendingBills,
            icon: 'Receipt',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            change: '-5%',
            changeColor: 'text-success'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statData.map((stat, i) => (
                <Card
                    key={stat.label}
                    animate={true}
                    initial={{ opacity: 0, y: 20 }}
                    animateProps={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className={`text-sm font-medium ${stat.changeColor}`}>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <StatDisplay
                            label={stat.label}
                            value={stat.value || 0}
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
};

AnalyticsOverview.propTypes = {
    stats: PropTypes.shape({
        totalPatients: PropTypes.number,
        activeDoctorCount: PropTypes.number,
        todayAppointments: PropTypes.number,
        pendingBills: PropTypes.number,
    }).isRequired,
};

export default AnalyticsOverview;