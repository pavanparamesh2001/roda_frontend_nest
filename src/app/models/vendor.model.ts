export interface CreateVendorDto {
  vendorCode: string;
  name?: string;
  contactPerson?: string;
  status?: string;

  contactNo: {
    primary: string;
    secondary?: string;
    whatsappNo?: string;
    backup?: string;
  };

  address?: string;
  pincode?: number;

  gst?: boolean;
  gstNo?: string;
  gstPercentage?: string;

  legalName?: string;
  email?: string;

  vendorType?: '2W' | '4W' | 'Both';

  state?: string;
  district?: string;
  agentName?: string;
  location?: string;
  DOB?: string;

  remarks?: string;

  bankAccountDetails?: {
    accountNo?: string;
    name?: string;
    bank?: string;
    branch?: string;
    ifsc?: string;
    panNo?: string;
    gpayNo?: string;
  };
}