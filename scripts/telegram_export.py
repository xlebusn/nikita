"""
Telegram export functionality
This script is meant to be called from the Next.js API routes
"""
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
import json
import sys
import os

async def export_members(api_id, api_hash, group_name, session_name="session"):
    """
    Export members from a Telegram group
    
    Args:
        api_id: Telegram API ID
        api_hash: Telegram API Hash
        group_name: Name or username of the group
        session_name: Session file name
    
    Returns:
        dict with members list or error
    """
    try:
        client = TelegramClient(session_name, int(api_id), api_hash)
        await client.start()
        
        # Find the group
        dialogs = await client.get_dialogs()
        target_chat = None
        
        for dialog in dialogs:
            try:
                if (dialog.name == group_name or 
                    (hasattr(dialog.entity, 'username') and 
                     dialog.entity.username and 
                     dialog.entity.username.lower() == group_name.lower())):
                    target_chat = dialog.entity
                    break
            except Exception:
                pass
        
        if target_chat is None:
            return {
                'error': 'Группа не найдена. Проверьте название или убедитесь, что вы состоите в группе.'
            }
        
        # Get participants
        participants = await client.get_participants(target_chat)
        
        members = []
        for user in participants:
            members.append({
                'first_name': user.first_name or '',
                'last_name': user.last_name or '',
                'username': user.username or '',
                'user_id': user.id
            })
        
        await client.disconnect()
        
        return {
            'success': True,
            'members': members,
            'count': len(members),
            'group_name': target_chat.title if hasattr(target_chat, 'title') else group_name
        }
        
    except Exception as e:
        return {
            'error': str(e)
        }

if __name__ == "__main__":
    # This allows the script to be called from Node.js
    import asyncio
    
    if len(sys.argv) < 4:
        print(json.dumps({'error': 'Missing arguments'}))
        sys.exit(1)
    
    api_id = sys.argv[1]
    api_hash = sys.argv[2]
    group_name = sys.argv[3]
    
    result = asyncio.run(export_members(api_id, api_hash, group_name))
    print(json.dumps(result))
