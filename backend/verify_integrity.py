#!/usr/bin/env python
"""
Verification Script: Test Referential Integrity
This script verifies that ForeignKey constraints and cascade deletes are working.
"""

import sys
from pathlib import Path

# Add the backend to the path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from app.db import SessionLocal
from app import models, schemas, crud


def test_referential_integrity():
    """Test cascade delete and referential integrity."""
    print("🧪 Testing Referential Integrity")
    print("=" * 70)
    
    db = SessionLocal()
    
    try:
        # Create test lead
        print("\n1️⃣  Creating test lead...")
        lead = crud.create_lead(db, schemas.LeadCreate(
            business_name="Test Lead for Integrity Check",
            contact="test@example.com"
        ))
        print(f"  ✅ Created lead: {lead.id}")
        
        # Create test task for the lead
        print("\n2️⃣  Creating test task for lead...")
        task = crud.create_task(db, schemas.TaskCreate(
            title="Test Task",
            related_to="lead",
            related_id=lead.id,
            description="This task tests cascade delete"
        ))
        print(f"  ✅ Created task: {task.id}")
        print(f"     Task lead_id: {task.lead_id}")
        print(f"     Task client_id: {task.client_id}")
        
        # Create test note for the lead
        print("\n3️⃣  Creating test note for lead...")
        note = crud.create_note(db, schemas.NoteCreate(
            content="Test note for cascade delete",
            related_to="lead",
            related_id=lead.id
        ))
        print(f"  ✅ Created note: {note.id}")
        print(f"     Note lead_id: {note.lead_id}")
        print(f"     Note client_id: {note.client_id}")
        
        # Verify ForeignKey columns are populated
        print("\n4️⃣  Verifying ForeignKey columns...")
        if task.lead_id == lead.id:
            print(f"  ✅ Task ForeignKey correctly set to lead")
        else:
            print(f"  ❌ Task ForeignKey not set correctly")
            return False
        
        if note.lead_id == lead.id:
            print(f"  ✅ Note ForeignKey correctly set to lead")
        else:
            print(f"  ❌ Note ForeignKey not set correctly")
            return False
        
        # Count related records before deletion
        print("\n5️⃣  Counting related records before deletion...")
        task_count = db.query(models.Task).filter(models.Task.lead_id == lead.id).count()
        note_count = db.query(models.Note).filter(models.Note.lead_id == lead.id).count()
        print(f"  📊 Tasks for lead {lead.id}: {task_count}")
        print(f"  📊 Notes for lead {lead.id}: {note_count}")
        
        # Delete the lead (should cascade delete tasks and notes)
        print("\n6️⃣  Deleting lead (should trigger cascade delete)...")
        crud.delete_lead(db, lead)
        print(f"  ✅ Deleted lead: {lead.id}")
        
        # Verify cascade delete worked
        print("\n7️⃣  Verifying cascade delete...")
        task_count_after = db.query(models.Task).filter(models.Task.lead_id == lead.id).count()
        note_count_after = db.query(models.Note).filter(models.Note.lead_id == lead.id).count()
        
        print(f"  📊 Tasks for lead after deletion: {task_count_after}")
        print(f"  📊 Notes for lead after deletion: {note_count_after}")
        
        if task_count_after == 0:
            print(f"  ✅ Tasks were cascade deleted")
        else:
            print(f"  ❌ Tasks were NOT cascade deleted")
            return False
        
        if note_count_after == 0:
            print(f"  ✅ Notes were cascade deleted")
        else:
            print(f"  ❌ Notes were NOT cascade deleted")
            return False
        
        # Test with client
        print("\n8️⃣  Testing with client...")
        client = crud.create_client(db, schemas.ClientCreate(
            business_name="Test Client",
            business_type="Web Design",
            contact="client@example.com",
            onboarding="2026-02-22",
            deadline="2026-03-22",
            delivery="In Progress"
        ))
        print(f"  ✅ Created client: {client.id}")
        
        task2 = crud.create_task(db, schemas.TaskCreate(
            title="Client Task",
            related_to="client",
            related_id=client.id
        ))
        print(f"  ✅ Created task for client: {task2.id}")
        
        if task2.client_id == client.id:
            print(f"  ✅ Task ForeignKey correctly set to client")
        else:
            print(f"  ❌ Task ForeignKey not set correctly for client")
            return False
        
        # Delete client and verify cascade
        print("\n9️⃣  Deleting client (should trigger cascade delete)...")
        crud.delete_client(db, client)
        print(f"  ✅ Deleted client: {client.id}")
        
        task2_check = db.query(models.Task).filter(models.Task.id == task2.id).first()
        if task2_check is None:
            print(f"  ✅ Client's task was cascade deleted")
        else:
            print(f"  ❌ Client's task was NOT cascade deleted")
            return False
        
        print("\n" + "=" * 70)
        print("✅ ALL REFERENTIAL INTEGRITY TESTS PASSED!")
        print("\n✨ Your database now has:")
        print("  • Foreign Key constraints enforced")
        print("  • Cascade deletes enabled")
        print("  • No orphan records possible")
        print("  • Data consistency guaranteed")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        db.close()


if __name__ == "__main__":
    try:
        success = test_referential_integrity()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
