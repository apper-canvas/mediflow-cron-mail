import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { billService, patientService } from '@/services';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import BillingStatsOverview from '@/components/organisms/BillingStatsOverview';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import BillForm from '@/components/organisms/BillForm';
import BillsListTable from '@/components/organisms/BillsListTable';
import EmptyState from '@/components/molecules/EmptyState';

const BillingPage = () => {
    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [formData, setFormData] = useState({
        patientId: '',
        appointmentId: '',
        items: [{ description: '', amount: 0 }]
    });

    const patientMap = useMemo(() => {
        return patients.reduce((acc, patient) => {
            acc[patient.id] = patient;
            return acc;
        }, {});
    }, [patients]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [billsData, patientsData] = await Promise.all([
                billService.getAll(),
                patientService.getAll()
            ]);
            setBills(billsData);
            setPatients(patientsData);
        } catch (err) {
            setError(err.message || 'Failed to load billing data');
            toast.error('Failed to load billing data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || formData.items.some(item => !item.description || !item.amount)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingBill) {
                await billService.update(editingBill.id, formData);
                toast.success('Bill updated successfully');
            } else {
                await billService.create(formData);
                toast.success('Bill created successfully');
            }

            resetForm();
            loadData();
        } catch (err) {
            toast.error(editingBill ? 'Failed to update bill' : 'Failed to create bill');
        }
    };

    const handleEdit = (bill) => {
        setFormData({
            patientId: bill.patientId,
            appointmentId: bill.appointmentId || '',
            items: bill.items || [{ description: '', amount: 0 }]
        });
        setEditingBill(bill);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bill?')) return;

        try {
            await billService.delete(id);
            toast.success('Bill deleted successfully');
            loadData();
        } catch (err) {
            toast.error('Failed to delete bill');
        }
    };

    const handleMarkAsPaid = async (id) => {
        try {
            await billService.markAsPaid(id);
            toast.success('Bill marked as paid');
            loadData();
        } catch (err) {
            toast.error('Failed to update bill status');
        }
    };

    const resetForm = () => {
        setFormData({
            patientId: '',
            appointmentId: '',
            items: [{ description: '', amount: 0 }]
        });
        setEditingBill(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : item
            )
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', amount: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-success text-white';
            case 'pending': return 'bg-warning text-white';
            case 'overdue': return 'bg-error text-white';
            default: return 'bg-surface-300 text-surface-700';
        }
    };

    const filteredBills = bills.filter(bill => {
        const patientName = patientMap[bill.patientId]?.name || `Patient #${bill.patientId}`;
        const matchesSearch =
            patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-surface-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex items-center justify-center min-h-96">
                <EmptyState
                    icon="AlertCircle"
                    title="Failed to load billing data"
                    message={error}
                    buttonText="Try Again"
                    onButtonClick={loadData}
                />
            </div>
        );
    }

    const headerActions = [
        {
            label: 'Create Bill',
            onClick: () => setShowForm(true),
            className: 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
            icon: 'Plus'
        }
    ];

    const statusFilterOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Billing"
                description="Manage patient bills and payments"
                actions={headerActions}
            />

            <BillingStatsOverview bills={bills} />

            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterValue={statusFilter}
                onFilterChange={setStatusFilter}
                filterOptions={statusFilterOptions}
                placeholder="Search bills..."
            />

            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingBill ? 'Edit Bill' : 'Create New Bill'}
            >
                <BillForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleItemChange={handleItemChange}
                    addItem={addItem}
                    removeItem={removeItem}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    patients={patients}
                    editingBill={editingBill}
                    totalAmount={totalAmount}
                />
            </Modal>

            <BillsListTable
                bills={filteredBills}
                patientMap={patientMap}
                getStatusColor={getStatusColor}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleMarkAsPaid={handleMarkAsPaid}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                setShowForm={setShowForm}
            />
        </div>
    );
};

export default BillingPage;