import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const MetricDisplay = ({ title, value, unit, description, icon, iconColor, delay }) => (
    <Card
        animate={true}
        initial={{ opacity: 0, y: 20 }}
        animateProps={{ opacity: 1, y: 0 }}
        transition={{ delay }}
    >
        <div className="flex items-center justify-between mb-4">
            <Heading level={3} className="text-lg font-semibold text-surface-900">{title}</Heading>
            <ApperIcon name={icon} className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="text-center">
            <Text as="div" className="text-3xl font-bold text-primary mb-2">
                {value}{unit}
            </Text>
            <Text as="p" className="text-surface-600 text-sm">{description}</Text>
        </div>
    </Card>
);

MetricDisplay.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    unit: PropTypes.string,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    delay: PropTypes.number,
};

const PerformanceMetrics = ({ quickMetrics, totalRevenue }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricDisplay
                title="Completion Rate"
                value={quickMetrics.appointmentCompletionRate}
                unit="%"
                description="Today's appointments completed"
                icon="TrendingUp"
                iconColor="text-success"
                delay={0.2}
            />
            <MetricDisplay
                title="Average Bill"
                value={`$${quickMetrics.averageBillAmount}`}
                description="Per patient billing amount"
                icon="DollarSign"
                iconColor="text-success"
                delay={0.3}
            />
            <MetricDisplay
                title="Total Revenue"
                value={`$${totalRevenue?.toLocaleString() || 0}`}
                description="From paid invoices"
                icon="TrendingUp"
                iconColor="text-success"
                delay={0.4}
            />
        </div>
    );
};

PerformanceMetrics.propTypes = {
    quickMetrics: PropTypes.shape({
        appointmentCompletionRate: PropTypes.number,
        averageBillAmount: PropTypes.number,
    }).isRequired,
    totalRevenue: PropTypes.number,
};

export default PerformanceMetrics;