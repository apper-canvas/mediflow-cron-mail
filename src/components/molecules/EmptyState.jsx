import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const EmptyState = ({ icon, title, message, buttonText, onButtonClick }) => {
    return (
        <Card className="text-center py-12">
            <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <Heading level={3} className="text-lg font-medium text-surface-900 mb-2">{title}</Heading>
            <Text as="p" className="text-surface-600 mb-6">{message}</Text>
            {onButtonClick && buttonText && (
                <Button
                    onClick={onButtonClick}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {buttonText}
                </Button>
            )}
        </Card>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    onButtonClick: PropTypes.func,
};

export default EmptyState;