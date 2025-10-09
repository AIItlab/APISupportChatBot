/**
 * Email upload utility - Helper script to validate and process customer email files
 * Run this script to test your email imports before deploying
 */

import { loadAllCustomerEmails } from '../lib/emailImport';
import { getCustomerEmailsForSearch } from '../lib/comprehensiveSearch';

console.log('🔍 Testing customer email import...\n');

// Test loading all customer emails
const allEmails = loadAllCustomerEmails();
console.log(`✅ Successfully loaded ${allEmails.length} customer emails from files`);

// Test search integration
const searchableContent = getCustomerEmailsForSearch();
console.log(`✅ Successfully prepared ${searchableContent.length} customer email entries for search`);

// Display sample content
if (searchableContent.length > 0) {
  console.log('\n📄 Sample customer email content:');
  console.log('=' .repeat(50));
  searchableContent.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. ${item.title}`);
    console.log(`   Content: ${item.content.substring(0, 100)}...`);
    console.log(`   Type: ${item.type}`);
    console.log('');
  });
}

// Show statistics
const categories = new Set(allEmails.map(email => email.category));
const tags = new Set(allEmails.flatMap(email => email.tags || []));

console.log('\n📊 Statistics:');
console.log(`- Total emails: ${allEmails.length}`);
console.log(`- Categories: ${categories.size} (${Array.from(categories).join(', ')})`);
console.log(`- Unique tags: ${tags.size}`);
console.log(`- Date range: ${allEmails.length > 0 ? `${Math.min(...allEmails.map(e => e.date))} to ${Math.max(...allEmails.map(e => e.date))}` : 'N/A'}`);

console.log('\n🎉 Email import test completed successfully!');
console.log('\nTo add your emails:');
console.log('1. Place CSV, JSON, or TXT files in the customer-emails/ directory');
console.log('2. Use the provided templates as examples');
console.log('3. Restart your development server to reload the content');
console.log('4. Test the chatbot with questions from your email data');
