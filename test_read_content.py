import os
from dotenv import load_dotenv
from notion_client import Client
from pprint import pprint

def read_page_content():
    # Load environment variables
    load_dotenv()
    
    notion_key = os.getenv('NOTION_API_KEY')
    
    # Use the page ID from our previous test
    page_id = "1b996e44-1742-81a5-baa8-e2b58af1533b"
    
    try:
        # Initialize Notion client
        notion = Client(auth=notion_key)
        
        # Get page metadata
        page = notion.pages.retrieve(page_id=page_id)
        print("📄 Page Metadata:")
        print(f"Title: {page['properties']['Doc name']['title'][0]['text']['content']}")
        categories = [cat['name'] for cat in page['properties']['Category']['multi_select']]
        print(f"Categories: {', '.join(categories)}")
        print(f"Created: {page['created_time']}")
        print(f"Last Edited: {page['last_edited_time']}")
        
        # Get page content
        print("\n📝 Page Content:")
        blocks = notion.blocks.children.list(block_id=page_id)
        
        if not blocks['results']:
            print("No content blocks found in the page.")
        
        for block in blocks['results']:
            block_type = block['type']
            print(f"\nBlock Type: {block_type}")
            
            if block_type == 'paragraph':
                if block['paragraph']['rich_text']:
                    text = block['paragraph']['rich_text'][0]['text']['content']
                    print(f"Text: {text}")
                else:
                    print("Empty paragraph")
                    
            elif block_type == 'heading_1':
                text = block['heading_1']['rich_text'][0]['text']['content']
                print(f"Heading 1: {text}")
                
            elif block_type == 'heading_2':
                text = block['heading_2']['rich_text'][0]['text']['content']
                print(f"Heading 2: {text}")
                
            elif block_type == 'heading_3':
                text = block['heading_3']['rich_text'][0]['text']['content']
                print(f"Heading 3: {text}")
                
            elif block_type == 'bulleted_list_item':
                text = block['bulleted_list_item']['rich_text'][0]['text']['content']
                print(f"• {text}")
                
            elif block_type == 'numbered_list_item':
                text = block['numbered_list_item']['rich_text'][0]['text']['content']
                print(f"1. {text}")
                
            elif block_type == 'to_do':
                text = block['to_do']['rich_text'][0]['text']['content']
                checked = block['to_do']['checked']
                print(f"[{'x' if checked else ' '}] {text}")
                
            elif block_type == 'code':
                text = block['code']['rich_text'][0]['text']['content']
                language = block['code']['language']
                print(f"Code ({language}):")
                print(text)
                
            else:
                print(f"Unsupported block type: {block_type}")
                pprint(block)
        
        return True
    except Exception as e:
        print(f"❌ Error reading page content: {str(e)}")
        return False

if __name__ == "__main__":
    read_page_content()
