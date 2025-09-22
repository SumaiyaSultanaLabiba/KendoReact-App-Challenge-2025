
import React from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Card } from '@progress/kendo-react-layout';

const NucliaSearch = ({ query, setQuery, onSearch }) => {
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Card style={{ padding: '20px', margin: '20px', backgroundColor: 'gray', color: 'black' }}>
      <div style={{fontSize: '30px', fontWeight: 'bold'}}>
      <h4>Ask something about Quran, Islam, or anything you want to know about your Lord...</h4>  
      <h5>Powered by Nuclia Semantic Search (English translation of the whole Quran is Knowledge Base of Nuclia)</h5>
      </div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.value)}
        placeholder="Ask something..."
        style={{ marginBottom: '10px' }}
      />
      <Button onClick={handleSearch}>Search</Button>
    </Card>
  );
};

export default NucliaSearch;
