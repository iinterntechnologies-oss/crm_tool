# Web Agency CRM - Technical Specifications Schema Update

## Summary of Changes

This implementation extends the Client and Customer models to better support web agency operations by adding technical specifications for domain management, hosting, content management systems, project lifecycle tracking, and recurring revenue tracking.

## Models Updated

### 1. **ProjectStage Enum** (New)
Added a new enumeration in `backend/app/models.py` to standardize project lifecycle stages:
- **Discovery** - Initial project discovery phase
- **Design** - Design phase
- **Development** - Active development
- **UAT** - User Acceptance Testing
- **Launched** - Project launched to production

**Location**: [backend/app/models.py](backend/app/models.py#L9-L15)

### 2. **Client Model Updated**
Added the following fields to track technical specifications for client projects:

| Field | Type | Default | Nullable | Purpose |
|-------|------|---------|----------|---------|
| `domain_name` | String(255) | NULL | Yes | Client's website domain name |
| `hosting_provider` | String(255) | NULL | Yes | Hosting service provider (e.g., AWS, GoDaddy, Bluehost) |
| `cms_type` | String(100) | NULL | Yes | Content Management System (e.g., WordPress, Next.js, Headless CMS) |
| `project_stage` | ProjectStage Enum | DISCOVERY | No | Current stage in project lifecycle |
| `maintenance_plan` | Boolean | False | No | Whether client has active maintenance plan |
| `renewal_date` | Date | NULL | Yes | Maintenance/subscription renewal date for recurring revenue tracking |

**Location**: [backend/app/models.py](backend/app/models.py#L45-L65)

### 3. **Customer Model Updated**
Added the following fields to track technical specifications and recurring revenue for completed projects:

| Field | Type | Default | Nullable | Purpose |
|-------|------|---------|----------|---------|
| `domain_name` | String(255) | NULL | Yes | Customer's website domain name |
| `hosting_provider` | String(255) | NULL | Yes | Hosting service provider |
| `cms_type` | String(100) | NULL | Yes | Content Management System |
| `maintenance_plan` | Boolean | False | No | Whether customer has ongoing maintenance plan |
| `renewal_date` | Date | NULL | Yes | Maintenance/support renewal date |

**Location**: [backend/app/models.py](backend/app/models.py#L69-L85)

## Schemas Updated

All Pydantic schemas have been updated to match the new model fields:

### ClientBase, ClientCreate, ClientOut
- Includes all new technical specification fields
- `project_stage` defaults to `ProjectStage.DISCOVERY`
- All new fields are optional except `project_stage`

### ClientUpdate
- All new fields are optional for partial updates
- Supports updating any combination of technical specifications

### CustomerBase, CustomerCreate, CustomerOut
- Includes technical specification fields (without `project_stage`)
- All new fields are optional

### CustomerUpdate
- All new fields are optional for partial updates

**Location**: [backend/app/schemas.py](backend/app/schemas.py#L1-L130)

## Database Migration

A migration script has been created to add the new columns to an existing database:

**Script**: [backend/migrate_add_technical_specs.py](backend/migrate_add_technical_specs.py)

### To Apply Migration:
```bash
cd backend
python migrate_add_technical_specs.py
```

### For Fresh Installations:
Run the normal database initialization - the new columns will be created automatically since the models define them.

## API Usage Examples

### Create a Client with Technical Specs
```python
{
    "business_name": "Acme Corp",
    "business_type": "E-commerce",
    "contact": "john@acme.com",
    "onboarding": "2026-01-15",
    "deadline": "2026-04-15",
    "delivery": "Web application",
    "payment_collected": 5000,
    "is_completed": false,
    "domain_name": "acme.com",
    "hosting_provider": "AWS",
    "cms_type": "Next.js",
    "project_stage": "Development",
    "maintenance_plan": true,
    "renewal_date": "2027-01-15"
}
```

### Update Client Technical Specs
```python
{
    "project_stage": "UAT",
    "cms_type": "Next.js",
    "hosting_provider": "Vercel"
}
```

### Convert Client to Customer
When a project is completed, you can convert the client record to a customer:
```python
{
    "business_name": "Acme Corp",
    "completed_date": "2026-04-15",
    "total_paid": 5000,
    "domain_name": "acme.com",
    "hosting_provider": "Vercel",
    "cms_type": "Next.js",
    "maintenance_plan": true,
    "renewal_date": "2027-01-15"
}
```

## Key Benefits

### 1. **Technical Tracking**
- Know exactly what tech stack each client/customer uses
- Identify support patterns (WordPress vs modern JAMstack sites)
- Optimize team skills and resource allocation

### 2. **Project Lifecycle Management**
- Replace generic "delivery" status with structured `project_stage` values
- Better project status tracking and reporting
- Consistent terminology across the organization

### 3. **Recurring Revenue Tracking**
- `maintenance_plan` boolean identifies high-value recurring revenue clients
- `renewal_date` enables automated alerts and forecasting
- Better business intelligence for MRR/ARR calculations

### 4. **Better Filter/Report Capabilities**
- Filter clients by CMS type (e.g., all WordPress sites)
- Generate reports by project stage
- Identify upcoming renewals for proactive customer engagement
- Track maintenance revenue separately from project revenue

## Notes

- All new fields are optional (`nullable=True`) for backward compatibility
- The `project_stage` field defaults to "Discovery" for new clients
- The `maintenance_plan` field defaults to `False`
- The CloudSQL/SQLite compatible migration script handles standard ALTER TABLE syntax
- Enum values are stored as strings in the database for portability

## Files Modified

1. **[backend/app/models.py](backend/app/models.py)** - Added ProjectStage Enum and extended Client/Customer models
2. **[backend/app/schemas.py](backend/app/schemas.py)** - Updated Pydantic schemas to match new models
3. **[backend/migrate_add_technical_specs.py](backend/migrate_add_technical_specs.py)** - New migration script for existing databases

## Testing Recommendations

- Test creating/updating clients with new technical fields
- Test `project_stage` enum validation
- Verify `renewal_date` sorting for upcoming renewals reports
- Test backward compatibility with existing clients/customers that don't have these fields set
