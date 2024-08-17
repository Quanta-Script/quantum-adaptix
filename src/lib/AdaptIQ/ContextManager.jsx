import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ContextManager = () => {
  const [context, setContext] = useState({});
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const updateContext = () => {
    if (key && value) {
      setContext(prevContext => ({
        ...prevContext,
        [key]: value
      }));
      setKey('');
      setValue('');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Contextual Interaction Manager</h2>
      <div className="flex space-x-2 mb-2">
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Context Key"
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Context Value"
        />
        <Button onClick={updateContext}>Add</Button>
      </div>
      <div>
        <h3 className="font-semibold">Current Context:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(context, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ContextManager;