import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-surface-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 max-w-md"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
                </motion.div>

                <Heading level={1} className="text-4xl font-bold text-surface-900 mb-4">404</Heading>
                <Heading level={2} className="text-xl font-semibold text-surface-700 mb-4">Page Not Found</Heading>
                <Text as="p" className="text-surface-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </Text>

                <div className="space-y-3">
                    <Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Go to Dashboard
                    </Button>

                    <Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="w-full px-6 py-3 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
                    >
                        Go Back
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;