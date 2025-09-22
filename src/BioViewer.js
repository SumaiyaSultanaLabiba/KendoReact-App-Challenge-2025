// BioViewer.js
import React, { useEffect, useState } from 'react';

function BioViewer() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/bio.html')
      .then(response => response.text())
      .then(setContent)
      .catch(error => console.error('Error loading bio:', error));
  }, []);

  return (
    <div
      className="bio-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default BioViewer;
