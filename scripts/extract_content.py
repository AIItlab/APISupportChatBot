import re
from bs4 import BeautifulSoup
import json

def extract_content():
    try:
        # Read input file
        with open('J9_OTA_NVTR_DIGITAL_INTEGRATION_KIT_V2.1-converted.html', 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Remove style tags and their content
        content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract text content without tags
        text_content = soup.get_text()
        
        # Write to file
        with open('extracted_content.txt', 'w', encoding='utf-8') as outfile:
            outfile.write(text_content)
            
        print("Content extracted successfully!")
    except FileNotFoundError:
        print("Error: Input HTML file not found!")
    except Exception as e:
        print(f"Error during content extraction: {str(e)}")

if __name__ == "__main__":
    extract_content()
