-- Migration: Add Referential Integrity with Foreign Keys and Cascade Deletes
-- Date: 2026-02-22
-- Description: Adds ForeignKey constraints to Task, Note, and Activity tables to prevent orphan rows
--              and implements cascade deletes to automatically clean up related records.

-- ============================================================================
-- Task Table: Add client_id and lead_id ForeignKey columns
-- ============================================================================
ALTER TABLE tasks ADD COLUMN client_id VARCHAR(36);
ALTER TABLE tasks ADD COLUMN lead_id VARCHAR(36);

-- Add ForeignKey constraints with CASCADE DELETE
ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_client_id 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_lead_id 
FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_task_client_id ON tasks(client_id);
CREATE INDEX idx_task_lead_id ON tasks(lead_id);

-- ============================================================================
-- Note Table: Add client_id and lead_id ForeignKey columns
-- ============================================================================
ALTER TABLE notes ADD COLUMN client_id VARCHAR(36);
ALTER TABLE notes ADD COLUMN lead_id VARCHAR(36);

-- Add ForeignKey constraints with CASCADE DELETE
ALTER TABLE notes 
ADD CONSTRAINT fk_notes_client_id 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE notes 
ADD CONSTRAINT fk_notes_lead_id 
FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_note_client_id ON notes(client_id);
CREATE INDEX idx_note_lead_id ON notes(lead_id);

-- ============================================================================
-- Activity Table: Add polymorphic ForeignKey columns
-- ============================================================================
ALTER TABLE activities ADD COLUMN lead_id VARCHAR(36);
ALTER TABLE activities ADD COLUMN client_id VARCHAR(36);
ALTER TABLE activities ADD COLUMN goal_id VARCHAR(36);
ALTER TABLE activities ADD COLUMN task_id VARCHAR(36);
ALTER TABLE activities ADD COLUMN customer_id VARCHAR(36);

-- Add ForeignKey constraints with CASCADE DELETE
ALTER TABLE activities 
ADD CONSTRAINT fk_activities_lead_id 
FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;

ALTER TABLE activities 
ADD CONSTRAINT fk_activities_client_id 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE activities 
ADD CONSTRAINT fk_activities_goal_id 
FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE;

ALTER TABLE activities 
ADD CONSTRAINT fk_activities_task_id 
FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;

ALTER TABLE activities 
ADD CONSTRAINT fk_activities_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX idx_activity_lead_id ON activities(lead_id);
CREATE INDEX idx_activity_client_id ON activities(client_id);
CREATE INDEX idx_activity_goal_id ON activities(goal_id);
CREATE INDEX idx_activity_task_id ON activities(task_id);
CREATE INDEX idx_activity_customer_id ON activities(customer_id);

-- ============================================================================
-- Populate ForeignKey columns from existing data using related_to and related_id
-- ============================================================================
-- For Tasks:
UPDATE tasks SET client_id = related_id WHERE related_to = 'client' AND related_id IS NOT NULL;
UPDATE tasks SET lead_id = related_id WHERE related_to = 'lead' AND related_id IS NOT NULL;

-- For Notes:
UPDATE notes SET client_id = related_id WHERE related_to = 'client' AND related_id IS NOT NULL;
UPDATE notes SET lead_id = related_id WHERE related_to = 'lead' AND related_id IS NOT NULL;

-- ============================================================================
-- Migration Verification
-- ============================================================================
-- Run these queries to verify the migration was successful:
-- SELECT COUNT(*) FROM tasks WHERE client_id IS NOT NULL OR lead_id IS NOT NULL;
-- SELECT COUNT(*) FROM notes WHERE client_id IS NOT NULL OR lead_id IS NOT NULL;
-- SELECT COUNT(*) FROM activities WHERE lead_id IS NOT NULL OR client_id IS NOT NULL;
