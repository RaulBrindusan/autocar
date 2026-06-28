# AutoMode Cloud Functions

This directory contains Firebase Cloud Functions for the AutoMode application.

## Functions

### `sendOfferEmail`

Automatically sends an email notification when a new offer is created in Firestore.

**Trigger:** Firestore onCreate event for `sent_requests` collection

**What it does:**
1. Listens for new documents in the `sent_requests` collection
2. Fetches the corresponding `car_request` document to get customer details
3. Downloads the PDF offer from Firebase Storage
4. Sends an email via Resend API with the PDF attached
5. Updates the `sent_request` document with email delivery status

**Email contains:**
- Customer name and personalized greeting
- Car details (brand, model, year, fuel type, transmission)
- Offered price
- PDF attachment with full offer details
- Call-to-action to visit AutoMode.ro

## Setup

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Configure Environment Variables

Set the Resend API key in Firebase Functions config:

```bash
firebase functions:config:set resend.api_key="your_resend_api_key_here"
```

To view current config:
```bash
firebase functions:config:get
```

### 3. Build TypeScript

```bash
npm run build
```

## Development

### Local Testing with Emulators

```bash
# Start Firebase emulators (from project root)
firebase emulators:start

# Or just functions emulator
npm run serve
```

The emulator UI will be available at http://localhost:4000

**Note:** For full testing, you'll need to:
1. Set up Firestore emulator
2. Set up Storage emulator
3. Create a test `car_request` document
4. Upload a test PDF to Storage
5. Create a `sent_request` document to trigger the function

### Watch Mode for Development

```bash
npm run build:watch
```

## Deployment

### Deploy All Functions

```bash
# From project root
firebase deploy --only functions

# Or from functions directory
npm run deploy
```

### Deploy Specific Function

```bash
firebase deploy --only functions:sendOfferEmail
```

### View Logs

```bash
# Real-time logs
firebase functions:log

# Follow logs
firebase functions:log --only sendOfferEmail

# From npm script
npm run logs
```

## Testing

### Manual Test

1. Go to Firebase Console > Firestore
2. Create a test document in `car_requests` collection:
   ```json
   {
     "contact_name": "Test User",
     "contact_email": "test@example.com",
     "brand": "BMW",
     "model": "X5",
     "year": 2023,
     "max_budget": 50000,
     "fuel_type": "Diesel",
     "transmission": "Automată",
     "status": "pending"
   }
   ```

3. Upload a test PDF to Storage at `sent-offers/{requestId}/test-offer.pdf`

4. Create a document in `sent_requests` collection:
   ```json
   {
     "request_id": "your_car_request_id",
     "price": 45000,
     "pdf_path": "sent-offers/{requestId}/test-offer.pdf",
     "pdf_url": "https://storage.googleapis.com/...",
     "timestamp": "2026-06-28T12:00:00Z"
   }
   ```

5. Check the function logs to see if the email was sent successfully
6. Check your test email inbox for the offer notification

### Error Handling

The function includes comprehensive error handling:

- **Missing fields:** Logs error and returns null (no retry)
- **CarRequest not found:** Logs error and returns null
- **PDF not found in Storage:** Logs error and returns null
- **Email send failure:** Logs error, updates Firestore with error details, returns error object
- **All errors:** Stored in the `sent_request` document under `email_error` field

## Monitoring

### Check Function Status

```bash
firebase functions:list
```

### View Function Details

```bash
firebase functions:config:get
```

### Check for Errors

In Firebase Console:
1. Go to Functions section
2. Click on `sendOfferEmail`
3. View the Logs tab for any errors

Or programmatically check the `sent_requests` collection for documents with:
- `email_sent: false`
- `email_error: "error message"`

## Troubleshooting

### Function Not Triggering

1. Check that the function is deployed: `firebase functions:list`
2. Verify Firestore triggers are enabled in Firebase Console
3. Check function logs: `firebase functions:log`

### Email Not Sending

1. Verify Resend API key is set correctly: `firebase functions:config:get`
2. Check Resend dashboard for delivery status
3. Verify sender domain (noreply@codemint.ro) is verified in Resend
4. Check function logs for detailed error messages

### PDF Not Found

1. Verify the `pdf_path` in `sent_request` matches the Storage path
2. Check Firebase Storage rules allow read access for the function
3. Ensure the PDF was uploaded successfully before creating the `sent_request`

### Resend API Key Not Found

When deploying, make sure to set the environment variable:
```bash
firebase functions:config:set resend.api_key="re_your_actual_key"
firebase deploy --only functions
```

## Cost Optimization

- The function only triggers on document creation (not updates)
- Errors are logged but don't trigger retries (to avoid infinite loops)
- PDF is downloaded only once per trigger
- Email status is tracked in Firestore to prevent duplicate sends

## Security

- Firebase Admin SDK is used with full privileges (runs server-side)
- Resend API key is stored securely in Functions config (not in code)
- Customer email addresses are validated before sending
- PDF files are only accessible to authenticated functions

## Future Enhancements

Potential improvements:
- [ ] Add retry logic with exponential backoff for transient errors
- [ ] Queue system for bulk offer notifications
- [ ] Email templates stored in Firestore for easy updates
- [ ] Support for multiple languages based on customer preference
- [ ] Track email opens and clicks via Resend webhooks
- [ ] Notification to admin dashboard when email fails
