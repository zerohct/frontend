import React from "react";
import { Company } from "types/companyTypes";

// Define props interface for type safety
interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-gray-300 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 ">
      <div className="relative h-48 overflow-hidden m-3">
        {company.image ? (
          <img
            src={`data:image/jpeg;base64,${company.image}`}
            alt={company.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <img
            src="/api/placeholder/400/320"
            alt="Company placeholder"
            className="w-full h-full object-cover rounded"
          />
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
