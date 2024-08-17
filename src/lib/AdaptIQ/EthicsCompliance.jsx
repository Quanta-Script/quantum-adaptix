import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EthicsCompliance = () => {
  const [action, setAction] = useState('');
  const [complianceLog, setComplianceLog] = useState([]);

  useEffect(() => {
    // Load compliance log from localStorage on component mount
    const savedLog = localStorage.getItem('complianceLog');
    if (savedLog) {
      setComplianceLog(JSON.parse(savedLog));
    }
  }, []);

  const checkCompliance = () => {
    const isCompliant = !action.toLowerCase().includes('confidential') &&
                        !action.toLowerCase().includes('private');
    const logEntry = {
      action,
      result: isCompliant ? 'Compliant' : 'Non-compliant',
      timestamp: new Date().toISOString()
    };
    const updatedLog = [...complianceLog, logEntry];
    setComplianceLog(updatedLog);
    localStorage.setItem('complianceLog', JSON.stringify(updatedLog));
    setAction('');

    if (!isCompliant) {
      alert('Warning: This action may violate ethical guidelines or privacy policies.');
    }
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
        <ul className="list-disc pl-5 max-h-40 overflow-y-auto">
          {complianceLog.map((entry, index) => (
            <li key={index} className={entry.result === 'Non-compliant' ? 'text-red-500' : 'text-green-500'}>
              {entry.action}: {entry.result} ({new Date(entry.timestamp).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EthicsCompliance;