# Customer Email Integration Guide

## 📧 How to Add Your Past Customer Emails

Your chatbot can now learn from your historical customer support interactions! Here's how to add your past emails:

## 📁 File Formats Supported

### 1. **CSV Format** (Recommended for bulk data)
```csv
date,customerQuestion,supportAnswer,category,tags
2024-01-15,"Customer question here","Your support answer here","booking","tag1,tag2,tag3"
```

### 2. **JSON Format** (Structured data)
```json
[
  {
    "id": "email_001",
    "date": "2024-01-15",
    "customerQuestion": "Customer question here",
    "supportAnswer": "Your support answer here",
    "category": "booking",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
```

### 3. **Text Format** (Simple Q&A)
```text
Q: Customer question here
A: Your support answer here
---
Q: Next question
A: Next answer
```

## 🚀 How to Add Your Emails

1. **Create your email file** in one of the supported formats
2. **Place the file** in the `customer-emails/` directory
3. **Restart your development server** to load the new content
4. **Test the chatbot** with questions from your email data

## 📂 Directory Structure
```
customer-emails/
├── your-emails.csv
├── more-emails.json
├── additional-emails.txt
└── sample-emails.csv (example)
```

## 🏷️ Categories & Tags

Use categories to organize your emails:
- `booking` - Booking-related questions
- `payment` - Payment and billing issues
- `technical` - Technical problems
- `changes` - Flight changes and modifications
- `refunds` - Refund requests
- `general` - General inquiries

Tags help with search relevance:
- `infant`, `booking`, `payment`, `error`, `authentication`, etc.

## 🔧 Testing Your Import

Run the test script to validate your email data:

```bash
node scripts/test-email-import.js
```

This will:
- ✅ Load all your email files
- ✅ Show statistics about your data
- ✅ Validate the format
- ✅ Display sample content

## 📊 What the Chatbot Learns

The chatbot will use your email data to:
- **Answer similar questions** based on your past responses
- **Understand your tone** and support style
- **Provide consistent answers** across all channels
- **Handle edge cases** you've encountered before

## 🎯 Best Practices

1. **Clean your data** - Remove personal information (names, phone numbers, emails)
2. **Categorize properly** - Use consistent category names
3. **Add relevant tags** - This improves search accuracy
4. **Update regularly** - Add new emails as you handle more cases
5. **Test thoroughly** - Always test the chatbot after adding new data

## 🔄 Updating Content

To add new emails:
1. Add files to `customer-emails/` directory
2. Restart the development server
3. The chatbot will automatically include the new content

## 🚨 Privacy & Security

- **Remove sensitive information** from email content
- **Don't include** customer names, contact details, or booking references
- **Focus on** the question-answer pairs that are generally helpful
- **Review content** before adding to ensure appropriateness

---

Your chatbot is now ready to learn from your customer support experience! 🎉
