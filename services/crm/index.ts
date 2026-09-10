export interface Lead {
  name: string;
  email: string;
  phone?: string;
  source: string;
  message?: string;
}

export interface CrmProvider {
  pushLead(lead: Lead): Promise<void>;
}

/**
 * MockCrmProvider just logs. Swap for a real HubSpot/Zoho adapter once
 * CRM_API_URL / CRM_API_KEY are set — callers only depend on CrmProvider.
 */
class MockCrmProvider implements CrmProvider {
  async pushLead(lead: Lead): Promise<void> {
    console.log("[CRM:mock] new lead ->", lead);
  }
}

let instance: CrmProvider | null = null;
export function getCrmProvider(): CrmProvider {
  if (!instance) instance = new MockCrmProvider();
  return instance;
}
