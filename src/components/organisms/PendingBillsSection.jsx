import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const PendingBillsSection = ({ bills, getStatusColor, patientMap }) => {
    const navigate = useNavigate();

    return (
        <Card animate initial={{ opacity: 0, y: 20 }} animateProps={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-between mb-4">
                <Heading level={2} className="text-lg font-semibold text-surface-900">Pending Bills</Heading>
                <Button
                    onClick={() => navigate('/billing')}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                    View all
                </Button>
            </div>

            {bills.length === 0 ? (
                <EmptyState
                    icon="Receipt"
                    title="No pending bills"
                    message="No pending bills"
                    buttonText="Create Bill"
                    onButtonClick={() => navigate('/billing')}
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-200">
                                <th className="text-left py-2 text-surface-600 font-medium text-sm">Bill ID</th>
                                <th className="text-left py-2 text-surface-600 font-medium text-sm">Patient</th>
                                <th className="text-left py-2 text-surface-600 font-medium text-sm">Amount</th>
                                <th className="text-left py-2 text-surface-600 font-medium text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill, i) => (
                                <motion.tr
                                    key={bill.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="hover:bg-surface-50 transition-colors cursor-pointer"
                                    onClick={() => navigate('/billing')}
                                >
                                    <td className="py-3 text-surface-900 font-medium">#{bill.id.slice(-6)}</td>
                                    <td className="py-3 text-surface-900">{patientMap[bill.patientId]?.name || `Patient #${bill.patientId}`}</td>
                                    <td className="py-3 text-surface-900 font-medium">${bill.total}</td>
                                    <td className="py-3">
                                        <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                            {bill.status}
                                        </Text>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};

PendingBillsSection.propTypes = {
    bills: PropTypes.array.isRequired,
    getStatusColor: PropTypes.func.isRequired,
    patientMap: PropTypes.object.isRequired,
};

export default PendingBillsSection;