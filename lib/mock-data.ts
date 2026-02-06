import type {
  CustomerSummary,
  CustomerHealthDetails,
  HealthSegment,
  CustomerEvent,
  UsageDataPoint,
  CustomerNote,
} from '@/types/customer';

// Generate consistent mock data
const owners = [
  { id: '1', name: 'Sarah Chen', avatarUrl: undefined, email: 'sarah.chen@flowdesk.com' },
  { id: '2', name: 'Marcus Johnson', avatarUrl: undefined, email: 'marcus.j@flowdesk.com' },
  { id: '3', name: 'Emily Rodriguez', avatarUrl: undefined, email: 'emily.r@flowdesk.com' },
  { id: '4', name: 'David Kim', avatarUrl: undefined, email: 'david.kim@flowdesk.com' },
];

const companies = [
  { name: 'Acme Corporation', domain: 'acme.com' },
  { name: 'TechStart Inc', domain: 'techstart.io' },
  { name: 'Global Solutions', domain: 'globalsolutions.com' },
  { name: 'Innovate Labs', domain: 'innovatelabs.co' },
  { name: 'DataDriven Co', domain: 'datadriven.com' },
  { name: 'CloudFirst Systems', domain: 'cloudfirst.io' },
  { name: 'NextGen Software', domain: 'nextgensoftware.com' },
  { name: 'Quantum Analytics', domain: 'quantumanalytics.ai' },
  { name: 'Stellar Dynamics', domain: 'stellardynamics.com' },
  { name: 'Apex Industries', domain: 'apexindustries.com' },
  { name: 'Pioneer Tech', domain: 'pioneertech.io' },
  { name: 'Velocity Partners', domain: 'velocitypartners.com' },
  { name: 'Summit Enterprises', domain: 'summitenterprises.com' },
  { name: 'Horizon Digital', domain: 'horizondigital.co' },
  { name: 'Catalyst Group', domain: 'catalystgroup.com' },
  { name: 'Fusion Labs', domain: 'fusionlabs.io' },
  { name: 'Elevate Solutions', domain: 'elevatesolutions.com' },
  { name: 'Synergy Corp', domain: 'synergycorp.com' },
  { name: 'Momentum Inc', domain: 'momentuminc.io' },
  { name: 'Vanguard Tech', domain: 'vanguardtech.com' },
  { name: 'Atlas Systems', domain: 'atlassystems.io' },
  { name: 'Pinnacle Software', domain: 'pinnaclesoftware.com' },
  { name: 'Nexus Innovations', domain: 'nexusinnovations.co' },
  { name: 'Prism Analytics', domain: 'prismanalytics.ai' },
  { name: 'Zenith Group', domain: 'zenithgroup.com' },
];

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function getHealthSegment(score: number): HealthSegment {
  if (score >= 70) return 'healthy';
  if (score >= 40) return 'watch';
  return 'at-risk';
}

function generateDaysAgo(random: () => number, maxDays: number): string {
  const daysAgo = Math.floor(random() * maxDays);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function generateMockCustomers(): CustomerSummary[] {
  const random = seededRandom(42);
  
  return companies.map((company, index) => {
    const healthScore = Math.floor(random() * 100);
    const mrr = Math.floor(random() * 50000) + 1000;
    
    return {
      id: `cust_${(index + 1).toString().padStart(3, '0')}`,
      name: company.name,
      domain: company.domain,
      mrr,
      lastActive: generateDaysAgo(random, 30),
      healthSegment: getHealthSegment(healthScore),
      healthScore,
      owner: owners[index % owners.length],
    };
  });
}

export function generateMockCustomerHealth(customerId: string): CustomerHealthDetails | null {
  const customers = generateMockCustomers();
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) return null;

  const random = seededRandom(parseInt(customerId.replace('cust_', ''), 10));
  
  // Generate recent events
  const eventTypes: CustomerEvent['type'][] = ['login', 'feature_used', 'support_ticket', 'meeting', 'email', 'note'];
  const recentEvents: CustomerEvent[] = Array.from({ length: 10 }, (_, i) => {
    const type = eventTypes[Math.floor(random() * eventTypes.length)];
    return {
      id: `evt_${i}`,
      type,
      title: getEventTitle(type, random),
      description: getEventDescription(type),
      timestamp: generateDaysAgo(random, 14),
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Generate usage trends (last 30 days)
  const usageTrends: UsageDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      activeUsers: Math.floor(random() * 50) + 10,
      sessions: Math.floor(random() * 200) + 50,
      featureAdoption: Math.floor(random() * 40) + 40,
    };
  });

  // Generate notes
  const notes: CustomerNote[] = Array.from({ length: 3 }, (_, i) => ({
    id: `note_${i}`,
    content: getNoteContent(i),
    createdAt: generateDaysAgo(random, 60),
    updatedAt: generateDaysAgo(random, 30),
    author: owners[Math.floor(random() * owners.length)],
  }));

  const ownerWithEmail = {
    ...customer.owner,
    email: owners.find(o => o.id === customer.owner.id)?.email || 'unknown@flowdesk.com',
  };

  return {
    id: customer.id,
    name: customer.name,
    domain: customer.domain,
    mrr: customer.mrr,
    arr: customer.mrr * 12,
    contractStartDate: generateDaysAgo(random, 365),
    contractEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    healthSegment: customer.healthSegment,
    healthScore: customer.healthScore,
    healthFactors: {
      engagement: Math.floor(random() * 100),
      adoption: Math.floor(random() * 100),
      support: Math.floor(random() * 100),
      growth: Math.floor(random() * 100),
    },
    owner: ownerWithEmail,
    recentEvents,
    usageTrends,
    notes,
  };
}

function getEventTitle(type: CustomerEvent['type'], random: () => number): string {
  const titles: Record<CustomerEvent['type'], string[]> = {
    login: ['User logged in', 'Admin session started', 'Mobile app login'],
    feature_used: ['Dashboard viewed', 'Report generated', 'Integration configured', 'Export completed'],
    support_ticket: ['Billing inquiry', 'Feature request', 'Bug report', 'Integration help'],
    meeting: ['QBR scheduled', 'Onboarding call', 'Check-in meeting', 'Training session'],
    email: ['Newsletter opened', 'Product update read', 'Survey response'],
    note: ['Internal note added', 'Follow-up reminder', 'Risk assessment'],
  };
  
  const options = titles[type];
  return options[Math.floor(random() * options.length)];
}

function getEventDescription(type: CustomerEvent['type']): string {
  const descriptions: Record<CustomerEvent['type'], string> = {
    login: 'User accessed the platform',
    feature_used: 'Customer engaged with product features',
    support_ticket: 'Support request submitted',
    meeting: 'Scheduled customer interaction',
    email: 'Email communication',
    note: 'Internal team note',
  };
  return descriptions[type];
}

function getNoteContent(index: number): string {
  const notes = [
    'Customer expressed interest in upgrading to Enterprise plan. Schedule follow-up call to discuss pricing and features.',
    'Completed quarterly business review. Customer is satisfied with current usage but wants more training for new team members.',
    'Noticed decreased login activity over the past 2 weeks. Reached out to check in - they mentioned internal restructuring.',
  ];
  return notes[index % notes.length];
}
