import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DataManager = () => {
  const [dataStore, setDataStore] = useState({});
  const [userId, setUserId] = useState('');
  const [data, setData] = useState('');

  const storeData = () => {
    if (userId && data) {
      setDataStore(prevStore => ({
        ...prevStore,
        [userId]: btoa(data) // Simple encoding for demonstration
      }));
      setUserId('');
      setData('');
    }
  };

  const retrieveData = (id) => {
    return dataStore[id] ? atob(dataStore[id]) : 'No data found';
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Data Segmentation and Privacy</h2>
      <div className="flex space-x-2 mb-2">
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <Input
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Data to store"
        />
        <Button onClick={storeData}>Store</Button>
      </div>
      <div>
        <h3 className="font-semibold">Stored Data:</h3>
        <ul>
          {Object.keys(dataStore).map(id => (
            <li key={id}>
              {id}: {retrieveData(id)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataManager;