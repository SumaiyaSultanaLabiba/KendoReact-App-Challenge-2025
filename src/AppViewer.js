// AppViewer.js
import { useEffect, useState } from 'react';

function AppViewer() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/app.html')
      .then(response => response.text())
      .then(setContent)
      .catch(error => console.error('Error loading app:', error));
  }, []);

  return (
    <div
      className="app-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default AppViewer;
