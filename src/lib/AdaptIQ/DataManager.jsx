import React, { useState, useEffect } from 'react';
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

  const generateHMAC = (data) => {
    return CryptoJS.HmacSHA256(data, secretKey).toString();
  };

  const storeData = () => {
    if (userId && data) {
      const encryptedData = encryptData(data);
      const hmac = generateHMAC(data);
      setDataStore(prevStore => ({
        ...prevStore,
        [userId]: { data: encryptedData, hmac }
      }));
      setUserId('');
      setData('');
    }
  };

  const retrieveData = (id) => {
    if (dataStore[id]) {
      const decryptedData = decryptData(dataStore[id].data);
      const hmac = generateHMAC(decryptedData);
      if (hmac === dataStore[id].hmac) {
        return decryptedData;
      } else {
        return 'Data integrity check failed';
      }
    }
    return 'No data found';
  };

  useEffect(() => {
    const storedData = localStorage.getItem('encryptedDataStore');
    if (storedData) {
      setDataStore(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('encryptedDataStore', JSON.stringify(dataStore));
  }, [dataStore]);

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