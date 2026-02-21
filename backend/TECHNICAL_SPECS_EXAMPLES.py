"""
EXAMPLE API USAGE AND PATTERNS for Technical Specifications

This file demonstrates how to use the new technical specifications fields
in your API endpoints and business logic.
"""

# ============================================================================
# EXAMPLE 1: Creating a Client with Technical Specifications
# ============================================================================

# HTTP POST /clients
# {
#     "business_name": "TechStartup Inc",
#     "business_type": "SaaS Platform",
#     "contact": "founder@techstartup.com",
#     "onboarding": "2026-02-21",
#     "deadline": "2026-08-21",
#     "delivery": "Custom web application",
#     "payment_collected": 15000,
#     "is_completed": false,
#     "domain_name": "techstartup.io",
#     "hosting_provider": "AWS",
#     "cms_type": "Next.js",
#     "project_stage": "Discovery",
#     "maintenance_plan": true,
#     "renewal_date": "2027-02-21"
# }


# ============================================================================
# EXAMPLE 2: Updating Project Status as It Progresses
# ============================================================================

# HTTP PATCH /clients/{client_id}
# 
# Week 2 - After discovery phase:
# {
#     "project_stage": "Design"
# }
#
# Week 6 - Development starts:
# {
#     "project_stage": "Development"
# }
#
# Week 14 - Client testing:
# {
#     "project_stage": "UAT"
# }
#
# Week 18 - Live:
# {
#     "project_stage": "Launched"
# }


# ============================================================================
# EXAMPLE 3: Backend Code - Filter Clients by CMS Type
# ============================================================================

# In routers/clients.py, add this endpoint:

"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..deps import get_db

router = APIRouter()

@router.get("/clients/by-cms/{cms_type}")
def get_clients_by_cms_type(
    cms_type: str,
    db: Session = Depends(get_db)
):
    '''
    Get all clients using a specific CMS type.
    Examples: WordPress, Next.js, Headless, etc.
    '''
    clients = db.query(models.Client).filter(
        models.Client.cms_type == cms_type
    ).all()
    return [schemas.ClientOut.from_orm(client) for client in clients]


@router.get("/clients/by-stage/{stage}")
def get_clients_by_stage(
    stage: schemas.ProjectStage,
    db: Session = Depends(get_db)
):
    '''
    Get all clients in a specific project stage.
    '''
    clients = db.query(models.Client).filter(
        models.Client.project_stage == stage
    ).all()
    return [schemas.ClientOut.from_orm(client) for client in clients]
"""


# ============================================================================
# EXAMPLE 4: Get Upcoming Renewals for Planning
# ============================================================================

"""
from datetime import date, timedelta

@router.get("/renewals/upcoming")
def get_upcoming_renewals(
    days_ahead: int = 30,
    db: Session = Depends(get_db)
):
    '''
    Get all customers with upcoming renewal dates.
    
    Args:
        days_ahead: Number of days to look ahead (default: 30)
    
    Returns:
        List of customers with renewal coming up
    '''
    today = date.today()
    cutoff_date = today + timedelta(days=days_ahead)
    
    customers = db.query(models.Customer).filter(
        models.Customer.renewal_date <= cutoff_date,
        models.Customer.renewal_date >= today,
        models.Customer.maintenance_plan == True
    ).order_by(models.Customer.renewal_date).all()
    
    return [schemas.CustomerOut.from_orm(c) for c in customers]
"""


# ============================================================================
# EXAMPLE 5: Analytics - CMS Distribution
# ============================================================================

"""
@router.get("/analytics/cms-distribution")
def get_cms_distribution(db: Session = Depends(get_db)):
    '''
    Get breakdown of clients/customers by CMS type.
    Useful for team planning and resource allocation.
    '''
    from sqlalchemy import func
    
    cms_stats = db.query(
        models.Client.cms_type,
        func.count(models.Client.id).label('count')
    ).group_by(
        models.Client.cms_type
    ).all()
    
    return {
        cms: count for cms, count in cms_stats
    }
    
    # Returns: {"Next.js": 5, "WordPress": 8, "Headless": 2, None: 3}
"""


# ============================================================================
# EXAMPLE 6: Manufacturing Maintenance Revenue Tracking
# ============================================================================

"""
@router.get("/analytics/maintenance-revenue")
def get_maintenance_revenue_forecast(db: Session = Depends(get_db)):
    '''
    Calculate monthly recurring revenue (MRR) from maintenance plans.
    '''
    maintenance_customers = db.query(models.Customer).filter(
        models.Customer.maintenance_plan == True
    ).all()
    
    # Assuming you add a maintenance_fee field in the future
    # total_mrr = sum(c.maintenance_fee for c in maintenance_customers)
    
    return {
        "total_maintenance_customers": len(maintenance_customers),
        "next_renewal_date": min(
            (c.renewal_date for c in maintenance_customers if c.renewal_date),
            default=None
        )
    }
"""


# ============================================================================
# EXAMPLE 7: Converting a Client to Customer (Project Completion)
# ============================================================================

"""
@router.post("/clients/{client_id}/convert-to-customer")
def convert_client_to_customer(
    client_id: str,
    db: Session = Depends(get_db)
):
    '''
    When a project is complete, convert the client to a customer.
    Preserves all technical specifications.
    '''
    client = db.query(models.Client).filter(
        models.Client.id == client_id
    ).first()
    
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Create customer with same technical specs
    customer = models.Customer(
        business_name=client.business_name,
        completed_date=date.today(),
        total_paid=client.payment_collected,
        domain_name=client.domain_name,
        hosting_provider=client.hosting_provider,
        cms_type=client.cms_type,
        maintenance_plan=client.maintenance_plan,
        renewal_date=client.renewal_date
    )
    
    db.add(customer)
    client.is_completed = True
    
    db.commit()
    db.refresh(customer)
    
    return schemas.CustomerOut.from_orm(customer)
"""


# ============================================================================
# EXAMPLE 8: Data Validation - CMS Type
# ============================================================================

"""
from pydantic import field_validator
from typing import Literal

# Update your ClientBase schema to validate CMS type:

VALID_CMS_TYPES = [
    "WordPress",
    "Next.js",
    "Headless CMS",
    "Shopify",
    "Webflow",
    "Wix",
    "Drupal",
    "Statamic",
    "Ghost",
    "Other"
]

class ClientBase(BaseModel):
    # ... existing fields ...
    cms_type: str | None = None
    
    @field_validator('cms_type')
    @classmethod
    def validate_cms_type(cls, v):
        if v is not None and v not in VALID_CMS_TYPES:
            raise ValueError(
                f'cms_type must be one of: {", ".join(VALID_CMS_TYPES)}'
            )
        return v
"""


# ============================================================================
# EXAMPLE 9: Reporting - Project Stage Distribution
# ============================================================================

"""
@router.get("/analytics/project-stages")
def get_project_stage_distribution(db: Session = Depends(get_db)):
    '''
    Get count of clients in each project stage.
    Useful for pipeline/workload visualization.
    '''
    from sqlalchemy import func
    
    stage_counts = db.query(
        models.Client.project_stage,
        func.count(models.Client.id).label('count')
    ).filter(
        models.Client.is_completed == False
    ).group_by(
        models.Client.project_stage
    ).all()
    
    return {
        stage.value: count for stage, count in stage_counts
    }
    
    # Returns:
    # {
    #   "Discovery": 3,
    #   "Design": 5,
    #   "Development": 8,
    #   "UAT": 2,
    #   "Launched": 0
    # }
"""


# ============================================================================
# EXAMPLE 10: Hosting Provider Analysis
# ============================================================================

"""
@router.get("/analytics/hosting-distribution")
def get_hosting_distribution(db: Session = Depends(get_db)):
    '''
    Get breakdown of clients/customers by hosting provider.
    Helps identify support needs and negotiation opportunities.
    '''
    from sqlalchemy import func
    
    hosting_stats = db.query(
        models.Client.hosting_provider,
        func.count(models.Client.id).label('count')
    ).filter(
        models.Client.hosting_provider.isnot(None)
    ).group_by(
        models.Client.hosting_provider
    ).all()
    
    return {
        provider: count for provider, count in hosting_stats
    }
    
    # Returns:
    # {
    #   "AWS": 12,
    #   "Vercel": 8,
    #   "GoDaddy": 5,
    #   "Bluehost": 3,
    #   "Digital Ocean": 4
    # }
"""
