## Payment Flow Testing

### 1. Create Payment Intent
- **URL**: POST http://localhost:3000/api/payments/create-payment-intent
- **Headers**:
  - Content-Type: application/json
  - Authorization: Bearer <your_jwt_token>
- **Body**:
```json
{
    "bookingId": "your_booking_id"
}
```
- **Expected Response**:
```json
{
    "status": "success",
    "clientSecret": "pi_xxxxx_secret_xxxxx"
}
```

### 2. Confirm Payment
- **URL**: POST http://localhost:3000/api/payments/confirm-payment
- **Headers**:
  - Content-Type: application/json
  - Authorization: Bearer <your_jwt_token>
- **Body**:
```json
{
    "paymentIntentId": "pi_xxxxx"
}
```
- **Expected Response**:
```json
{
    "status": "success",
    "data": {
        "booking details..."
    }
}
```

## Testing Tips
1. Use Stripe test card numbers:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
2. Use any future expiry date
3. Use any 3-digit CVC
