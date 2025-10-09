from bs4 import BeautifulSoup
import json

def parse_html():
    try:
        # Read and parse HTML file
        with open('../J9_OTA_NVTR_DIGITAL_INTEGRATION_KIT_V2.1-converted.html', 'r', encoding='utf-8') as file:
            soup = BeautifulSoup(file, 'html.parser')
        
        # Extract all headings and their content
        sections = []
        for tag in soup.find_all(['h1', 'h2', 'h3', 'h4']):
            if not tag or not tag.text.strip():
                continue
                
            section = {
                'type': tag.name,
                'title': tag.text.strip(),
                'content': []
            }
            
            # Get all content until the next heading
            next_tag = tag.find_next_sibling()
            while next_tag and next_tag.name not in ['h1', 'h2', 'h3', 'h4']:
                if next_tag.name in ['p', 'ul', 'ol', 'table']:
                    content = str(next_tag).strip()
                    if content:  # Only add non-empty content
                        section['content'].append(content)
                next_tag = next_tag.find_next_sibling()
            
            # Only add sections with content
            if section['content']:
                sections.append(section)
        
        if not sections:
            print("Warning: No content sections found in the HTML file!")
            return
            
        # Write to JSON file
        with open('doc_sections.json', 'w', encoding='utf-8') as outfile:
            json.dump(sections, outfile, indent=2, ensure_ascii=False)
            
        print(f"Successfully parsed {len(sections)} sections!")
    except FileNotFoundError:
        print("Error: HTML file not found! Please check the file path.")
    except Exception as e:
        print(f"Error during HTML parsing: {str(e)}")

if __name__ == '__main__':
    parse_html()
