import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EthicsCompliance = () => {
  const [action, setAction] = useState('');
  const [complianceLog, setComplianceLog] = useState([]);

  const checkCompliance = () => {
    const isCompliant = !action.toLowerCase().includes('confidential');
    const logEntry = {
      action,
      result: isCompliant ? 'Compliant' : 'Non-compliant',
      timestamp: new Date().toISOString()
    };
    setComplianceLog(prevLog => [...prevLog, logEntry]);
    setAction('');
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Ethics and Compliance Framework</h2>
      <div className="flex space-x-2 mb-2">
        <Input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Enter action to check compliance"
        />
        <Button onClick={checkCompliance}>Check</Button>
      </div>
      <div>
        <h3 className="font-semibold">Compliance Log:</h3>
        <ul className="list-disc pl-5">
          {complianceLog.map((entry, index) => (
            <li key={index}>
              {entry.action}: {entry.result} ({entry.timestamp})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EthicsCompliance;