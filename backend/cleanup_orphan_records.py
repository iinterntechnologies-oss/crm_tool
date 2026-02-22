#!/usr/bin/env python
"""
Database Cleanup Script: Remove Orphan Records
This script deletes tasks, notes, and activities that reference non-existent entities.
"""

import sys
from pathlib import Path
from sqlalchemy import and_

# Add the backend to the path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from app.db import SessionLocal
from app import models


def cleanup_orphan_records():
    """Remove tasks, notes, and activities with invalid references."""
    print("🧹 Starting Orphan Records Cleanup")
    print("=" * 70)
    
    db = SessionLocal()
    
    try:
        # Count before cleanup
        tasks_before = db.query(models.Task).count()
        notes_before = db.query(models.Note).count()
        activities_before = db.query(models.Activity).count()
        
        print(f"📊 Before cleanup:")
        print(f"  • Tasks: {tasks_before}")
        print(f"  • Notes: {notes_before}")
        print(f"  • Activities: {activities_before}")
        
        # Cleanup Tasks
        print(f"\n🧹 Cleaning up Tasks...")
        
        # Delete tasks with invalid client references
        client_orphans = 0
        for task in db.query(models.Task).filter(models.Task.related_to == 'client').all():
            client = db.query(models.Client).filter(models.Client.id == task.related_id).first()
            if not client:
                print(f"  ❌ Deleting orphan task: {task.id} (references non-existent client {task.related_id})")
                db.delete(task)
                client_orphans += 1
        
        db.commit()
        print(f"  ✅ Deleted {client_orphans} tasks with invalid client references")
        
        # Delete tasks with invalid lead references
        lead_orphans = 0
        for task in db.query(models.Task).filter(models.Task.related_to == 'lead').all():
            lead = db.query(models.Lead).filter(models.Lead.id == task.related_id).first()
            if not lead:
                print(f"  ❌ Deleting orphan task: {task.id} (references non-existent lead {task.related_id})")
                db.delete(task)
                lead_orphans += 1
        
        db.commit()
        print(f"  ✅ Deleted {lead_orphans} tasks with invalid lead references")
        
        # Cleanup Notes
        print(f"\n🧹 Cleaning up Notes...")
        
        # Delete notes with invalid client references
        note_client_orphans = 0
        for note in db.query(models.Note).filter(models.Note.related_to == 'client').all():
            client = db.query(models.Client).filter(models.Client.id == note.related_id).first()
            if not client:
                print(f"  ❌ Deleting orphan note: {note.id} (references non-existent client {note.related_id})")
                db.delete(note)
                note_client_orphans += 1
        
        db.commit()
        print(f"  ✅ Deleted {note_client_orphans} notes with invalid client references")
        
        # Delete notes with invalid lead references
        note_lead_orphans = 0
        for note in db.query(models.Note).filter(models.Note.related_to == 'lead').all():
            lead = db.query(models.Lead).filter(models.Lead.id == note.related_id).first()
            if not lead:
                print(f"  ❌ Deleting orphan note: {note.id} (references non-existent lead {note.related_id})")
                db.delete(note)
                note_lead_orphans += 1
        
        db.commit()
        print(f"  ✅ Deleted {note_lead_orphans} notes with invalid lead references")
        
        # Cleanup Activities
        print(f"\n🧹 Cleaning up Activities...")
        
        activity_orphans = 0
        for activity in db.query(models.Activity).all():
            valid = False
            
            # Check if entity still exists
            if activity.entity_type == 'lead' and activity.entity_id:
                if db.query(models.Lead).filter(models.Lead.id == activity.entity_id).first():
                    valid = True
            elif activity.entity_type == 'client' and activity.entity_id:
                if db.query(models.Client).filter(models.Client.id == activity.entity_id).first():
                    valid = True
            elif activity.entity_type == 'customer' and activity.entity_id:
                if db.query(models.Customer).filter(models.Customer.id == activity.entity_id).first():
                    valid = True
            elif activity.entity_type == 'goal' and activity.entity_id:
                if db.query(models.Goal).filter(models.Goal.id == activity.entity_id).first():
                    valid = True
            elif activity.entity_type == 'task' and activity.entity_id:
                if db.query(models.Task).filter(models.Task.id == activity.entity_id).first():
                    valid = True
            
            if not valid:
                print(f"  ❌ Deleting orphan activity: {activity.id} (references non-existent {activity.entity_type} {activity.entity_id})")
                db.delete(activity)
                activity_orphans += 1
        
        db.commit()
        print(f"  ✅ Deleted {activity_orphans} activities with invalid references")
        
        # Count after cleanup
        tasks_after = db.query(models.Task).count()
        notes_after = db.query(models.Note).count()
        activities_after = db.query(models.Activity).count()
        
        print(f"\n" + "=" * 70)
        print(f"📊 After cleanup:")
        print(f"  • Tasks: {tasks_after} (removed {tasks_before - tasks_after})")
        print(f"  • Notes: {notes_after} (removed {notes_before - notes_after})")
        print(f"  • Activities: {activities_after} (removed {activities_before - activities_after})")
        
        total_removed = (tasks_before - tasks_after) + (notes_before - notes_after) + (activities_before - activities_after)
        print(f"\n✅ Cleanup complete! Removed {total_removed} orphan records total.")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Cleanup failed: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        db.close()


if __name__ == "__main__":
    try:
        success = cleanup_orphan_records()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
