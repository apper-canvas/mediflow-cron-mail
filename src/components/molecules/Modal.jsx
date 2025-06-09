import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <Heading level={2} className="text-xl font-bold text-surface-900">
                                        {title}
                                    </Heading>
                                    <Button
                                        onClick={onClose}
                                        className="text-surface-400 hover:text-surface-600 p-2"
                                    >
                                        <ApperIcon name="X" className="w-6 h-6" />
                                    </Button>
                                </div>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.string,
};

export default Modal;