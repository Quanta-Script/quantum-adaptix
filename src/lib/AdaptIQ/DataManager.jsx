import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CryptoJS from 'crypto-js';

const DataManager = () => {
  const [dataStore, setDataStore] = useState({});
  const [userId, setUserId] = useState('');
  const [data, setData] = useState('');
  const secretKey = 'your-secret-key'; // In a real app, this should be securely stored

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const storeData = () => {
    if (userId && data) {
      const encryptedData = encryptData(data);
      setDataStore(prevStore => ({
        ...prevStore,
        [userId]: encryptedData
      }));
      setUserId('');
      setData('');
    }
  };

  const retrieveData = (id) => {
    return dataStore[id] ? decryptData(dataStore[id]) : 'No data found';
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