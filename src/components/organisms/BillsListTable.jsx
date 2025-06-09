import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const BillsListTable = ({
    bills,
    patientMap,
    getStatusColor,
    handleEdit,
    handleDelete,
    handleMarkAsPaid,
    searchTerm,
    statusFilter,
    setShowForm,
}) => {
    return (
        <Card>
            {bills.length === 0 ? (
                <EmptyState
                    icon="Receipt"
                    title="No bills found"
                    message={searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first bill to get started'}
                    buttonText="Create Bill"
                    onButtonClick={() => setShowForm(true)}
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-surface-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Bill ID</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Patient</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Date</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Amount</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Status</th>
                                <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill, i) => (
                                <motion.tr
                                    key={bill.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <Text as="p" className="font-medium text-surface-900">#{bill.id.slice(-6)}</Text>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Text as="p" className="font-medium text-surface-900">{patientMap[bill.patientId]?.name || `Patient #${bill.patientId}`}</Text>
                                        <Text as="p" className="text-sm text-surface-600">ID: {bill.patientId}</Text>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Text as="p" className="text-surface-900">{bill.date}</Text>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Text as="p" className="font-semibold text-surface-900">${bill.total}</Text>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Text as="span" className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                            {bill.status}
                                        </Text>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex space-x-2">
                                            {bill.status === 'pending' && (
                                                <Button
                                                    onClick={() => handleMarkAsPaid(bill.id)}
                                                    className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                                                    title="Mark as Paid"
                                                >
                                                    <ApperIcon name="CheckCircle" className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => handleEdit(bill)}
                                                className="p-1 text-surface-600 hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <ApperIcon name="Edit" className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(bill.id)}
                                                className="p-1 text-surface-600 hover:text-error transition-colors"
                                                title="Delete"
                                            >
                                                <ApperIcon name="Trash2" className="w-4 h-4" />
                                            </Button>
                                        </div>
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

BillsListTable.propTypes = {
    bills: PropTypes.array.isRequired,
    patientMap: PropTypes.object.isRequired,
    getStatusColor: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleMarkAsPaid: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    statusFilter: PropTypes.string.isRequired,
    setShowForm: PropTypes.func.isRequired,
};

export default BillsListTable;