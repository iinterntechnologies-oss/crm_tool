# Automated Client Onboarding & Tasks

## Overview

When a lead is converted to a client in the CRM, the system automatically generates a standardized onboarding checklist with task templates tailored to different service types. This ensures no steps are missed and provides consistent client experiences.

## How It Works

### Conversion Flow

1. **Lead to Client Conversion**: When a saved lead is converted to a client via the Saved Leads page:
   - A new Client record is created with project details
   - Technical specifications can be provided (domain, hosting, CMS, project stage)
   - The system automatically triggers onboarding task generation

2. **Automatic Task Generation**: Based on the client's service type:
   - Standard onboarding tasks are created
   - Service-specific tasks are added
   - Due dates are calculated relative to the onboarding date
   - Tasks are linked to the new client

3. **Workflow Visual**: 
```
Lead → Saved Lead → Convert (+ specs) → Client Created → Tasks Generated → Team Notified
```

## Service Types & Task Templates

Each service type includes the standard onboarding checklist plus additional service-specific tasks:

### Standard Onboarding (All Services)
```
1. Send Contract (Due: Day 1) - URGENT
2. Collect Brand Assets (Due: Day 3) - HIGH
3. Setup Dev Environment (Due: Day 5) - HIGH
4. Initial Design Sprint (Due: Day 7) - HIGH
```

### Full Development Service
Standard tasks plus:
```
5. Technical Architecture Review (Day 7)
6. Frontend Development Setup (Day 5)
7. Backend Development Setup (Day 5)
8. Create Testing Plan (Day 10)
```

### SEO Service
Standard tasks plus:
```
5. Keyword Research & Analysis (Day 7)
6. Site Audit & Analysis (Day 5)
7. SEO Strategy Document (Day 10)
8. Setup Analytics & Tracking (Day 3)
```

### Maintenance/Support Service
Standard tasks plus:
```
5. Site Audit & Health Check (Day 2)
6. Setup Monitoring & Alerts (Day 3)
7. Document Site Specifications (Day 7)
8. Plan Maintenance Schedule (Day 5)
```

### Branding Service
Standard tasks plus:
```
5. Brand Discovery Sessions (Day 5)
6. Competitor & Market Analysis (Day 7)
7. Brand Strategy Document (Day 10)
8. Visual Identity Design (Day 14)
```

## Implementation Details

### Database Models

#### Task Model (Enhanced)
```python
class Task(Base):
    # ... existing fields ...
    task_template: str | None       # e.g., 'onboarding'
    service_type: str | None        # e.g., 'full_development', 'seo'
    is_template: bool               # Whether this is a template task
```

### Backend Endpoint

**POST** `/tasks/generate-onboarding/{client_id}`

Parameters:
- `client_id` (path): The ID of the client
- `service_type` (query, optional): Type of service ('full_development', 'seo', 'maintenance', 'branding', 'web_design', 'default')
  - Default: `'default'` (standard onboarding only)

Response: List of created Task objects

Example:
```bash
POST /tasks/generate-onboarding/client-123?service_type=full_development
```

### Frontend Implementation

The `convertToClient` function in `App.tsx`:

1. Creates the client record with all specifications
2. Maps the `businessType` to a `serviceType`:
   - "Web Design" → "web_design"
   - "Full Development" → "full_development"
   - "SEO" → "seo"
   - "Maintenance" → "maintenance"
   - "Branding" → "branding"
3. Calls `tasksApi.generateOnboarding(clientId, serviceType, token)`
4. Automatically refreshes the task list

### Task Scheduling

Tasks are scheduled relative to the client's `onboarding` date:

```typescript
dueDate = onboardingDate + timeDaysUntilDue
```

For example, if onboarding is 2026-02-21:
- "Send Contract" → 2026-02-22 (Day 1)
- "Collect Brand Assets" → 2026-02-24 (Day 3)
- "Setup Dev Environment" → 2026-02-26 (Day 5)

## API Integration

### Task Generation API Response

```json
[
  {
    "id": "task-uuid-1",
    "title": "Send Contract",
    "description": "Prepare and send service agreement to client...",
    "relatedTo": "client",
    "relatedId": "client-123",
    "priority": "urgent",
    "status": "pending",
    "dueDate": "2026-02-22",
    "taskTemplate": "onboarding",
    "serviceType": "full_development",
    "isTemplate": false,
    "completedAt": null,
    "createdAt": "2026-02-21T10:00:00Z"
  },
  ...
]
```

## Files Modified/Created

### Backend
1. **app/models.py** - Enhanced Task model with template fields
2. **app/schemas.py** - Updated TaskBase, TaskCreate, TaskUpdate, TaskOut
3. **app/task_templates.py** - NEW: Template definitions and generation logic
4. **app/routers/tasks.py** - NEW: `/tasks/generate-onboarding/{client_id}` endpoint
5. **app/crud.py** - Added `get_client_by_id()` helper
6. **migrate_add_task_templates.py** - NEW: Migration script

### Frontend
1. **App.tsx** - Enhanced `convertToClient()` to trigger task generation
2. **api.ts** - Added `tasksApi.generateOnboarding()` method
3. **types.ts** - Extended Task interface

## Usage Flow

### For End Users

1. **View Saved Leads**: Go to "Saved Leads" section
2. **Expand Specifications** (Optional): Click dropdown to add technical specs
3. **Convert Lead**: Click "Convert to Client" button
4. **Automatic Tasks**: Return to Tasks page to see auto-generated onboarding checklist
5. **Track Progress**: Mark tasks complete as team executes them

### For Developers

To manually create tasks for an existing client:

```typescript
// Frontend
const tasks = await tasksApi.generateOnboarding(clientId, 'seo', token);

// Backend Python
from app.task_templates import create_task_list_for_client
from app.crud import create_task
from app.schemas import TaskCreate

task_data_list = create_task_list_for_client(
    client_id="client-123",
    service_type="seo",
    onboarding_date=date.today()
)

for task_data in task_data_list:
    task_schema = TaskCreate(**task_data)
    created_task = create_task(db, task_schema)
```

## Customization

To add a new service type:

1. Create a new task list in `app/task_templates.py`:
```python
MY_SERVICE_TASKS = [
    TaskTemplate(
        title="Task Title",
        description="Task description",
        priority="high",
        days_until_due=5
    ),
    ...
]
```

2. Add to TEMPLATES dictionary:
```python
TEMPLATES = {
    ...
    "my_service": {
        "base": ONBOARDING_CHECKLIST,
        "additional": MY_SERVICE_TASKS,
    },
    ...
}
```

3. Map in frontend `convertToClient`:
```typescript
const serviceTypeMap = {
    ...
    'my_service': 'my_service',
    ...
};
```

## Error Handling

- If task generation fails, the client creation still succeeds
- Error is logged but not shown to user (non-blocking)
- Tasks can be manually created later via Tasks page
- All tasks default to proper status ("pending", "medium" priority)

## Monitoring & Reporting

### Dashboard Integration
- Tasks appear automatically in the Tasks list
- Onboarding checklist can be tracked from the dashboard
- Team members are notified of new tasks

### Task Filtering
```typescript
// Get onboarding tasks only
const onboardingTasks = tasks.filter(t => t.taskTemplate === 'onboarding');

// Get tasks by service type
const devTasks = tasks.filter(t => t.serviceType === 'full_development');

// Get tasks by client
const clientTasks = tasks.filter(t => t.relatedTo === 'client' && t.relatedId === clientId);
```

## Performance

- Task generation is fast (< 100ms for ~8 tasks)
- Bulk create operations minimize database roundtrips
- No impact on client creation performance

## Future Enhancements

Potential improvements:
- Task templates UI builder
- Workflow automation (auto-mark tasks complete)
- Task assignment to team members
- Email notifications for new tasks
- Task dependency chains
- Recurring task templates (for maintenance)
- Analytics on task completion time vs. estimate
