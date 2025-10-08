/**
 * Email data import utility for processing customer email files
 * Supports CSV and JSON formats for bulk import of customer interactions
 */

import * as fs from 'node:fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { CustomerEmail } from './emailData';

/**
 * Import customer emails from CSV file
 * Expected CSV format: date,customerQuestion,supportAnswer,category,tags
 */
export const importFromCSV = (filePath: string): CustomerEmail[] => {
  try {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    return records.map((record: any, index: number) => ({
      id: `imported_${index + 1}`,
      date: record.date || new Date().toISOString().split('T')[0],
      customerQuestion: record.customerQuestion || record.question || '',
      supportAnswer: record.supportAnswer || record.answer || '',
      category: record.category || 'general',
      tags: record.tags ? record.tags.split(',').map((tag: string) => tag.trim()) : []
    }));
  } catch (error) {
    console.error('Error importing CSV:', error);
    return [];
  }
};

/**
 * Import customer emails from JSON file
 */
export const importFromJSON = (filePath: string): CustomerEmail[] => {
  try {
    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonContent);
    
    if (Array.isArray(data)) {
      return data.map((item: any, index: number) => ({
        id: item.id || `imported_${index + 1}`,
        date: item.date || new Date().toISOString().split('T')[0],
        customerQuestion: item.customerQuestion || item.question || '',
        supportAnswer: item.supportAnswer || item.answer || '',
        category: item.category || 'general',
        tags: item.tags || []
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error importing JSON:', error);
    return [];
  }
};

/**
 * Import emails from text file (simple Q&A format)
 * Expected format:
 * Q: Customer question here
 * A: Support answer here
 * ---
 * Q: Next question
 * A: Next answer
 */
export const importFromText = (filePath: string): CustomerEmail[] => {
  try {
    const textContent = fs.readFileSync(filePath, 'utf-8');
    const sections = textContent.split('---').filter(section => section.trim());
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      let question = '';
      let answer = '';
      let currentSection = '';
      
      lines.forEach(line => {
        if (line.startsWith('Q:')) {
          currentSection = 'question';
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          currentSection = 'answer';
          answer = line.substring(2).trim();
        } else if (line.trim() && currentSection === 'question') {
          question += ' ' + line.trim();
        } else if (line.trim() && currentSection === 'answer') {
          answer += ' ' + line.trim();
        }
      });
      
      return {
        id: `text_import_${index + 1}`,
        date: new Date().toISOString().split('T')[0],
        customerQuestion: question,
        supportAnswer: answer,
        category: 'imported',
        tags: []
      };
    }).filter(item => item.customerQuestion && item.supportAnswer);
  } catch (error) {
    console.error('Error importing text file:', error);
    return [];
  }
};

/**
 * Load customer emails from various sources
 * Checks for files in the project directory and imports them
 */
export const loadAllCustomerEmails = (): CustomerEmail[] => {
  const allEmails: CustomerEmail[] = [];
  const dataDirectory = path.join(process.cwd(), 'customer-emails');
  
  // Check if customer-emails directory exists
  if (fs.existsSync(dataDirectory)) {
    const files = fs.readdirSync(dataDirectory);
    
    files.forEach(file => {
      const filePath = path.join(dataDirectory, file);
      const ext = path.extname(file).toLowerCase();
      
      switch (ext) {
        case '.csv':
          console.log(`Importing CSV file: ${file}`);
          allEmails.push(...importFromCSV(filePath));
          break;
        case '.json':
          console.log(`Importing JSON file: ${file}`);
          allEmails.push(...importFromJSON(filePath));
          break;
        case '.txt':
          console.log(`Importing text file: ${file}`);
          allEmails.push(...importFromText(filePath));
          break;
      }
    });
  }
  
  console.log(`Loaded ${allEmails.length} customer emails from files`);
  return allEmails;
};

export default loadAllCustomerEmails;
