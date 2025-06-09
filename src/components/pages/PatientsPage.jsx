import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { patientService } from '@/services';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import PatientForm from '@/components/organisms/PatientForm';
import PatientCardsDisplay from '@/components/organisms/PatientCardsDisplay';
import EmptyState from '@/components/molecules/EmptyState';

const PatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        bloodGroup: '',
        medicalHistory: []
    });
    const [medicalHistoryInput, setMedicalHistoryInput] = useState('');

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await patientService.getAll();
            setPatients(data);
        } catch (err) {
            setError(err.message || 'Failed to load patients');
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const patientData = {
                ...formData,
                medicalHistory: medicalHistoryInput
                    ? medicalHistoryInput.split(',').map(item => item.trim()).filter(Boolean)
                    : []
            };

            if (editingPatient) {
                await patientService.update(editingPatient.id, patientData);
                toast.success('Patient updated successfully');
            } else {
                await patientService.create(patientData);
                toast.success('Patient created successfully');
            }

            resetForm();
            loadPatients();
        } catch (err) {
            toast.error(editingPatient ? 'Failed to update patient' : 'Failed to create patient');
        }
    };

    const handleEdit = (patient) => {
        setFormData({
            name: patient.name,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            email: patient.email,
            phone: patient.phone,
            address: patient.address,
            bloodGroup: patient.bloodGroup,
            medicalHistory: patient.medicalHistory || []
        });
        setMedicalHistoryInput((patient.medicalHistory || []).join(', '));
        setEditingPatient(patient);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;

        try {
            await patientService.delete(id);
            toast.success('Patient deleted successfully');
            loadPatients();
        } catch (err) {
            toast.error('Failed to delete patient');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            phone: '',
            address: '',
            bloodGroup: '',
            medicalHistory: []
        });
        setMedicalHistoryInput('');
        setEditingPatient(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

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
                    title="Failed to load patients"
                    message={error}
                    buttonText="Try Again"
                    onButtonClick={loadPatients}
                />
            </div>
        );
    }

    const headerActions = [
        {
            label: 'Add Patient',
            onClick: () => setShowForm(true),
            className: 'mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
            icon: 'UserPlus'
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Patients"
                description="Manage patient records and information"
                actions={headerActions}
            />

            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search patients by name, email, or phone..."
            />

            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
            >
                <PatientForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    medicalHistoryInput={medicalHistoryInput}
                    setMedicalHistoryInput={setMedicalHistoryInput}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    editingPatient={editingPatient}
                />
            </Modal>

            <PatientCardsDisplay
                patients={filteredPatients}
                searchTerm={searchTerm}
                setShowForm={setShowForm}
                calculateAge={calculateAge}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default PatientsPage;