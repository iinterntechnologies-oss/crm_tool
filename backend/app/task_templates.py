"""
Task Templates for Automated Client Onboarding

This module defines task templates that are automatically generated when
a lead is converted to a client.
"""

from datetime import date, timedelta
from typing import TypedDict, Optional

class TaskTemplate(TypedDict):
    title: str
    description: str
    priority: str
    days_until_due: int

# Standard Onboarding Tasks (applies to all service types)
ONBOARDING_CHECKLIST = [
    TaskTemplate(
        title="Send Contract",
        description="Prepare and send service agreement to client for signature. Include project scope, timeline, payment terms, and deliverables.",
        priority="urgent",
        days_until_due=1
    ),
    TaskTemplate(
        title="Collect Brand Assets",
        description="Request and collect all brand assets from client: logo files, brand guidelines, style guides, existing marketing materials, content, and any design preferences.",
        priority="high",
        days_until_due=3
    ),
    TaskTemplate(
        title="Setup Dev Environment",
        description="Configure development environment: repositories, hosting, databases, version control, testing servers, and domain setup.",
        priority="high",
        days_until_due=5
    ),
    TaskTemplate(
        title="Initial Design Sprint",
        description="Conduct initial design/strategy meeting with client. Review requirements, create wireframes, establish design system, and get approval on visual direction.",
        priority="high",
        days_until_due=7
    ),
]

# Full Development Service Tasks
FULL_DEVELOPMENT_TASKS = [
    TaskTemplate(
        title="Technical Architecture Review",
        description="Review and finalize technical stack, system architecture, database design, API specifications, and security requirements.",
        priority="high",
        days_until_due=7
    ),
    TaskTemplate(
        title="Frontend Development Setup",
        description="Initialize frontend project structure, establish coding standards, setup build tools, testing framework, and component library.",
        priority="high",
        days_until_due=5
    ),
    TaskTemplate(
        title="Backend Development Setup",
        description="Initialize backend project structure, setup database schema, configure API endpoints, authentication, and deployment pipeline.",
        priority="high",
        days_until_due=5
    ),
    TaskTemplate(
        title="Create Testing Plan",
        description="Develop comprehensive testing strategy: unit tests, integration tests, E2E tests, performance testing, and UAT criteria.",
        priority="medium",
        days_until_due=10
    ),
]

# SEO Service Tasks
SEO_TASKS = [
    TaskTemplate(
        title="Keyword Research & Analysis",
        description="Conduct comprehensive keyword research, analyze competition, identify opportunity keywords, and create target keyword list.",
        priority="high",
        days_until_due=7
    ),
    TaskTemplate(
        title="Site Audit & Analysis",
        description="Perform SEO audit of current site (if existing): technical SEO, on-page optimization, backlink profile, and competitive analysis.",
        priority="high",
        days_until_due=5
    ),
    TaskTemplate(
        title="SEO Strategy Document",
        description="Create detailed SEO strategy document: goals, timeline, metrics, content plan, technical improvements, and link building strategy.",
        priority="high",
        days_until_due=10
    ),
    TaskTemplate(
        title="Setup Analytics & Tracking",
        description="Setup Google Analytics 4, Search Console, rank tracking tools, and conversion tracking. Create baseline metrics dashboard.",
        priority="medium",
        days_until_due=3
    ),
]

# Maintenance/Support Service Tasks
MAINTENANCE_TASKS = [
    TaskTemplate(
        title="Site Audit & Health Check",
        description="Perform comprehensive site audit: performance metrics, security scan, broken links, outdated content, and technical issues.",
        priority="high",
        days_until_due=2
    ),
    TaskTemplate(
        title="Setup Monitoring & Alerts",
        description="Configure uptime monitoring, performance monitoring, security alerts, and error tracking tools.",
        priority="high",
        days_until_due=3
    ),
    TaskTemplate(
        title="Document Site Specifications",
        description="Create/update comprehensive documentation: site architecture, dependencies, admin processes, backup procedures, and disaster recovery plan.",
        priority="medium",
        days_until_due=7
    ),
    TaskTemplate(
        title="Plan Maintenance Schedule",
        description="Create monthly maintenance schedule: updates, backups, security patches, performance optimization, and content review.",
        priority="medium",
        days_until_due=5
    ),
]

# Branding Service Tasks
BRANDING_TASKS = [
    TaskTemplate(
        title="Brand Discovery Sessions",
        description="Conduct brand discovery workshops to understand company values, target audience, positioning, and unique selling propositions.",
        priority="high",
        days_until_due=5
    ),
    TaskTemplate(
        title="Competitor & Market Analysis",
        description="Analyze competitor branding, market trends, industry standards, and identify positioning opportunities.",
        priority="high",
        days_until_due=7
    ),
    TaskTemplate(
        title="Brand Strategy Document",
        description="Create comprehensive brand strategy: positioning, messaging, visual direction, tone of voice, and brand guidelines outline.",
        priority="high",
        days_until_due=10
    ),
    TaskTemplate(
        title="Visual Identity Design",
        description="Design brand identity elements: logo concepts, color palette, typography, imagery style, and brand applications.",
        priority="high",
        days_until_due=14
    ),
]

# Template Mapping
TEMPLATES = {
    "full_development": {
        "base": ONBOARDING_CHECKLIST,
        "additional": FULL_DEVELOPMENT_TASKS,
    },
    "seo": {
        "base": ONBOARDING_CHECKLIST,
        "additional": SEO_TASKS,
    },
    "maintenance": {
        "base": ONBOARDING_CHECKLIST,
        "additional": MAINTENANCE_TASKS,
    },
    "branding": {
        "base": ONBOARDING_CHECKLIST,
        "additional": BRANDING_TASKS,
    },
    "web_design": {
        "base": ONBOARDING_CHECKLIST,
        "additional": [],
    },
    "default": {
        "base": ONBOARDING_CHECKLIST,
        "additional": [],
    },
}

def get_onboarding_tasks(service_type: str = "default") -> list:
    """
    Get the task template list for a given service type.
    
    Args:
        service_type: Type of service (e.g., 'full_development', 'seo', 'maintenance', 'branding')
    
    Returns:
        List of TaskTemplate dictionaries
    """
    template = TEMPLATES.get(service_type, TEMPLATES["default"])
    return template["base"] + template["additional"]

def create_task_list_for_client(
    client_id: str,
    service_type: str = "default",
    onboarding_date: Optional[date] = None,
) -> list:
    """
    Generate a list of task dictionaries ready to be created in the database.
    
    Args:
        client_id: ID of the client to assign tasks to
        service_type: Type of service for the client
        onboarding_date: Start date for calculating due dates (defaults to today)
    
    Returns:
        List of task dictionaries ready for database creation
    """
    if onboarding_date is None:
        onboarding_date = date.today()
    
    templates = get_onboarding_tasks(service_type)
    tasks = []
    
    for template in templates:
        due_date = onboarding_date + timedelta(days=template["days_until_due"])
        
        task = {
            "title": template["title"],
            "description": template["description"],
            "related_to": "client",
            "related_id": client_id,
            "priority": template["priority"],
            "status": "pending",
            "due_date": due_date.isoformat(),
            "task_template": "onboarding",
            "service_type": service_type,
            "is_template": False,
        }
        tasks.append(task)
    
    return tasks
