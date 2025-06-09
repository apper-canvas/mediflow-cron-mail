import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { prescriptionService, patientService, doctorService } from '@/services'; // Removed appointmentService as it's not directly used for data fetching in this page

import DashboardHeader from '@/components/organisms/DashboardHeader';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import PrescriptionForm from '@/components/organisms/PrescriptionForm';
import PrescriptionCardsDisplay from '@/components/organisms/PrescriptionCardsDisplay';
import EmptyState from '@/components/molecules/EmptyState';

const PrescriptionsPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentId: '',
        diagnosis: '',
        medications: [{ name: '', dosage: '', duration: '' }]
    });

    const patientMap = useMemo(() => {
        return patients.reduce((acc, patient) => {
            acc[patient.id] = patient;
            return acc;
        }, {});
    }, [patients]);

    const doctorMap = useMemo(() => {
        return doctors.reduce((acc, doctor) => {
            acc[doctor.id] = doctor;
            return acc;
        }, {});
    }, [doctors]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [prescriptionsData, patientsData, doctorsData] = await Promise.all([
                prescriptionService.getAll(),
                patientService.getAll(),
                doctorService.getAll(),
                // appointmentService.getAll() // No direct use, removed for clarity and minimal dependency in this page
            ]);
            setPrescriptions(prescriptionsData);
            setPatients(patientsData);
            setDoctors(doctorsData);
            // setAppointments(appointmentsData);
        } catch (err) {
            setError(err.message || 'Failed to load prescriptions');
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.doctorId || !formData.diagnosis ||
            formData.medications.some(med => !med.name || !med.dosage || !med.duration)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingPrescription) {
                await prescriptionService.update(editingPrescription.id, formData);
                toast.success('Prescription updated successfully');
            } else {
                await prescriptionService.create(formData);
                toast.success('Prescription created successfully');
            }

            resetForm();
            loadData();
        } catch (err) {
            toast.error(editingPrescription ? 'Failed to update prescription' : 'Failed to create prescription');
        }
    };

    const handleEdit = (prescription) => {
        setFormData({
            patientId: prescription.patientId,
            doctorId: prescription.doctorId,
            appointmentId: prescription.appointmentId || '',
            diagnosis: prescription.diagnosis,
            medications: prescription.medications || [{ name: '', dosage: '', duration: '' }]
        });
        setEditingPrescription(prescription);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this prescription?')) return;

        try {
            await prescriptionService.delete(id);
            toast.success('Prescription deleted successfully');
            loadData();
        } catch (err) {
            toast.error('Failed to delete prescription');
        }
    };

    const resetForm = () => {
        setFormData({
            patientId: '',
            doctorId: '',
            appointmentId: '',
            diagnosis: '',
            medications: [{ name: '', dosage: '', duration: '' }]
        });
        setEditingPrescription(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMedicationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.map((med, i) =>
                i === index ? { ...med, [field]: value } : med
            )
        }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, { name: '', dosage: '', duration: '' }]
        }));
    };

    const removeMedication = (index) => {
        if (formData.medications.length > 1) {
            setFormData(prev => ({
                ...prev,
                medications: prev.medications.filter((_, i) => i !== index)
            }));
        }
    };

    const handlePrint = (prescription) => {
        const printWindow = window.open('', '_blank');
        const patientName = patientMap[prescription.patientId]?.name || `Patient #${prescription.patientId}`;
        const doctorName = doctorMap[prescription.doctorId]?.name ? `Dr. ${doctorMap[prescription.doctorId].name}` : `Doctor #${prescription.doctorId}`;

        printWindow.document.write(`
            <html>
            <head>
                <title>Prescription - ${patientName}</title>
                <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
                .prescription-details { margin-bottom: 20px; }
                .medications { margin-top: 20px; }
                .medication-item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                <h1>MediFlow Hospital</h1>
                <h2>Prescription</h2>
                </div>

                <div class="prescription-details">
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Doctor:</strong> ${doctorName}</p>
                <p><strong>Date:</strong> ${prescription.date}</p>
                <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
                </div>

                <div class="medications">
                <h3>Medications:</h3>
                ${prescription.medications.map(med => `
                    <div class="medication-item">
                    <p><strong>${med.name}</strong></p>
                    <p>Dosage: ${med.dosage}</p>
                    <p>Duration: ${med.duration}</p>
                    </div>
                `).join('')}
                </div>

                <div class="footer">
                <p>Generated on ${new Date().toLocaleDateString()}</p>
                <p>MediFlow Healthcare Management System</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };


    const filteredPrescriptions = prescriptions.filter(prescription =>
        (patientMap[prescription.patientId]?.name || `Patient #${prescription.patientId}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctorMap[prescription.doctorId]?.name || `Doctor #${prescription.doctorId}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                    title="Failed to load prescriptions"
                    message={error}
                    buttonText="Try Again"
                    onButtonClick={loadData}
                />
            </div>
        );
    }

    const headerActions = [
        {
            label: 'Create Prescription',
            onClick: () => setShowForm(true),
            className: 'mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
            icon: 'Plus'
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Prescriptions"
                description="Manage patient prescriptions and medications"
                actions={headerActions}
            />

            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search prescriptions by patient, doctor, diagnosis, or medication..."
            />

            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingPrescription ? 'Edit Prescription' : 'Create New Prescription'}
                maxWidth="max-w-3xl"
            >
                <PrescriptionForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleMedicationChange={handleMedicationChange}
                    addMedication={addMedication}
                    removeMedication={removeMedication}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    patients={patients}
                    doctors={doctors}
                    editingPrescription={editingPrescription}
                />
            </Modal>

            <PrescriptionCardsDisplay
                prescriptions={filteredPrescriptions}
                searchTerm={searchTerm}
                setShowForm={setShowForm}
                patientMap={patientMap}
                doctorMap={doctorMap}
                handlePrint={handlePrint}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default PrescriptionsPage;