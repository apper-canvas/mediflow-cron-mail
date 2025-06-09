import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import ListItem from '@/components/molecules/ListItem';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const RecentActivityLog = ({ recentActivity }) => {
    return (
        <Card animate initial={{ opacity: 0, x: -20 }} animateProps={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center justify-between mb-6">
                <Heading level={3} className="text-lg font-semibold text-surface-900">Recent Activity</Heading>
                <Button className="text-primary hover:text-primary/80 text-sm font-medium">
                    View all
                </Button>
            </div>

            {recentActivity.length === 0 ? (
                <EmptyState
                    icon="Activity"
                    title="No recent activity"
                    message="No recent activity to display."
                />
            ) : (
                <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                        <ListItem
                            key={activity.id}
                            animate
                            delay={0.6 + i * 0.1}
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <ApperIcon name={activity.icon} className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <Text as="p" className="text-surface-900 text-sm font-medium truncate">
                                    {activity.message}
                                </Text>
                                <Text as="p" className="text-surface-600 text-xs">{activity.time}</Text>
                            </div>
                        </ListItem>
                    ))}
                </div>
            )}
        </Card>
    );
};

RecentActivityLog.propTypes = {
    recentActivity: PropTypes.array.isRequired,
};

export default RecentActivityLog;