import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/molecules/Card';
import StatDisplay from '@/components/molecules/StatDisplay';
import ApperIcon from '@/components/ApperIcon';
const BillingStatsOverview = ({ bills = [] }) => {
    const safeBills = bills || [];
    const paidBillsCount = safeBills.filter(b => b?.status === 'paid').length;
    const pendingBillsCount = safeBills.filter(b => b?.status === 'pending').length;
    const totalRevenue = safeBills.filter(b => b?.status === 'paid').reduce((sum, b) => sum + (b?.total || 0), 0);

    const statData = [
        {
            label: 'Total Bills',
            value: safeBills.length,
            icon: 'Receipt',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
        },
        {
            label: 'Paid Bills',
            value: paidBillsCount,
            icon: 'CheckCircle',
            color: 'text-success',
            bgColor: 'bg-success/10'
        },
        {
            label: 'Pending Bills',
            value: pendingBillsCount,
            icon: 'Clock',
            color: 'text-warning',
            bgColor: 'bg-warning/10'
        },
        {
            label: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: 'DollarSign',
            color: 'text-success',
            bgColor: 'bg-success/10'
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
                    <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <StatDisplay
                            label={stat.label}
                            value={stat.value}
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
};

BillingStatsOverview.propTypes = {
    bills: PropTypes.array,
};

export default BillingStatsOverview;