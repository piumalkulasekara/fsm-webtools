'use client';

import React, { useState } from 'react';
import { PersonStatusDropdown } from '@/components/ui/dropdowns/PersonStatusDropdown';

export default function PersonStatusTestPage() {
  const [selectedStatus, setSelectedStatus] = useState('');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Person Status Dropdown Test</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Person Status</h2>
        <div className="max-w-md">
          <PersonStatusDropdown
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
        
        <div className="mt-4">
          <p>Selected value: <span className="font-mono">{selectedStatus}</span></p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Details</h2>
        <p className="mb-2">
          This dropdown is populated from the METRIX_CODE_TABLE with the following query:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
          {`SELECT code_value, message_id FROM METRIX_CODE_TABLE 
WHERE code_name = 'PERSON_STATUS' AND active = 'Y'`}
        </pre>
        <p className="mt-4 mb-2">
          The corresponding OData request is:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
          {`/odata/METRIX_CODE_TABLE?$select=code_value,message_id
&$filter=code_name eq 'PERSON_STATUS' and active eq 'Y'`}
        </pre>
      </div>
    </div>
  );
} 