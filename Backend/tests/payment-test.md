# Payment Testing Steps

## 1. Create Payment Intent
POST http://localhost:3000/api/payments/create-payment-intent

```json
{
    "bookingId": "65a123..." // Your actual booking ID
}
```

## 2. Process Payment
POST http://localhost:3000/api/payments/process-payment

```json
{
    "paymentIntentId": "pi_...", // From step 1
    "paymentMethod": "pm_card_visa"
}
```

Note: The customer will be created automatically based on the authenticated user's details.
