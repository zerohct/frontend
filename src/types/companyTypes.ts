export interface Company {
  companyId: number;
  name: string;
  description: string;
  image?: string;
}

export interface CompanyRequest {
  name: string;
  description: string;
  image?: File;
}
