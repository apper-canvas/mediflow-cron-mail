import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/molecules/Card';
import StatDisplay from '@/components/molecules/StatDisplay';

const DashboardOverviewStats = ({ stats }) => {
    const statData = [
        { label: 'Total Patients', value: stats.totalPatients, icon: 'Users', iconColor: 'text-primary', iconBgColor: 'bg-primary/10' },
        { label: 'Total Doctors', value: stats.totalDoctors, icon: 'UserCheck', iconColor: 'text-success', iconBgColor: 'bg-success/10' },
        { label: "Today's Appointments", value: stats.todayAppointments, icon: 'Calendar', iconColor: 'text-info', iconBgColor: 'bg-info/10' },
        { label: 'Pending Bills', value: stats.pendingBills, icon: 'Receipt', iconColor: 'text-warning', iconBgColor: 'bg-warning/10' }
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
                    <StatDisplay
                        label={stat.label}
                        value={stat.value || 0}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        iconBgColor={stat.iconBgColor}
                    />
                </Card>
            ))}
        </div>
    );
};

DashboardOverviewStats.propTypes = {
    stats: PropTypes.shape({
        totalPatients: PropTypes.number,
        totalDoctors: PropTypes.number,
        todayAppointments: PropTypes.number,
        pendingBills: PropTypes.number,
    }).isRequired,
};

export default DashboardOverviewStats;