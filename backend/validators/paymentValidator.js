const { body } = require('express-validator');

exports.validatePaymentInitiation = [
    body('bookingId')
        .notEmpty()
        .withMessage('Booking ID is required')
        .isMongoId()
        .withMessage('Invalid booking ID format'),

    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be greater than 0'),

    body('paymentMethod')
        .optional()
        .isIn(['card', 'netbanking', 'wallet', 'upi'])
        .withMessage('Invalid payment method')
];