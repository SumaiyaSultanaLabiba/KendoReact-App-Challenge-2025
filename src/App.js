import { Card, CardBody, CardActions } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { TextArea } from '@progress/kendo-react-inputs';
import BioViewer from './BioViewer';
import AppViewer from './AppViewer';
import { useState } from 'react';
import { surahList } from './surahList';
import NucliaSearch from './components/NucliaSearch';
import { useRef } from 'react';


import './App.css';
import {
  AppBar,
  AppBarSection,
  TabStrip,
  TabStripTab,
  StackLayout
} from '@progress/kendo-react-layout';
import '@progress/kendo-theme-default/dist/all.css';

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [surahNumber, setSurahNumber] = useState(null);
  const [surahText, setSurahText] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const audioRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);


  const searchNuclia = async (queryText) => {
    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      const extractedResults = [];

      if (data.resources) {
        Object.values(data.resources).forEach(resource => {
          if (resource.fields) {
            Object.values(resource.fields).forEach(field => {
              if (field.paragraphs) {
                Object.values(field.paragraphs).forEach(p => {
                  if (p.text) {
                    extractedResults.push({ text: p.text });
                  }
                });
              }
            });
          }
        });
      }

      setResults(extractedResults.length > 0 ? extractedResults : [{ text: "No matching verses found." }]);
    } catch (error) {
      console.error("Search error:", error);
      setResults([{ text: "Error fetching results. Please check your API key, KB ID, or endpoint." }]);
    }
  };

  const handleSurahClick = async (surahNumber) => {
  setLoading(true);
  setSurahNumber(surahNumber);
  setSurahText('');
  setOpen(true);
  try {
    const response = await fetch(`/Translations/${surahNumber}.txt`);
    const text = await response.text();

    if (text.includes('<!DOCTYPE html>')) {
      throw new Error("Fallback HTML received instead of translation.");
    }

    setSurahText(text);
  } catch (error) {
    console.error("Error loading translation:", error);
    setSurahText("Translation not available for this Surah.");
  } finally {
    await sleep(1000);
    setLoading(false);
  }
};





  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'Gray' }}>
        {/* AppBar */}
        <AppBar style={{ backgroundColor: '#000000', color: 'Khaki' }}>
          <AppBarSection>
            <h1 style={{ margin: 0, fontSize: '20px', color: 'Khaki' }}>Quranic Verse Explorer</h1>
          </AppBarSection>
        </AppBar>

        {/* TabStrip for Views */}
        <TabStrip
          selected={selectedTab}
          onSelect={(e) => setSelectedTab(e.selected)}
          style={{ margin: '20px', backgroundColor: "Khaki"}}
        >
          <TabStripTab title="Search" style={{color:"Red"}}>
            <div style={{backgroundColor: "Black", color: "Khaki", padding: '10px'}}>
            <StackLayout orientation="vertical" gap={20} style={{ padding: '20px'}}>
              <NucliaSearch
              query={query}
              setQuery={setQuery}
              onSearch={searchNuclia}
            />

            <div>
              {query && <h4>Showing results for: {query}</h4>}
              {results.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <strong>Result {idx + 1}:</strong> {item.text}
                </div>
              ))}
            </div>

            </StackLayout>
            </div>
          </TabStripTab>

            
            <TabStripTab title="Explore">
              <div style={{ padding: '40px'}}>
                <div style={{color: "Khaki", fontSize:"25px"}}>
                <h3>Click on any Surah to listen to the peaceful recitation and explore its meaning</h3>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '32px',
                    justifyContent: 'flex-start'
                  }}
                >
                  {surahList.map(surah => (
                            <Card
                            key={surah.number}
                            style={{
                              width: 300,
                              height: 250,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                            onClick={() => handleSurahClick(surah.number)}
                          >
                            {/* Custom Top Bar */}
                            <div
                              style={{
                                background: 'khaki',
                                color: 'black',
                                padding: '12px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'
                              }}
                            >
                              Chapter: {surah.number} | {surah.name} <br /> {surah.meaning}
                            </div>

                            {/* Image Section */}
                            <img
                              src={surah.imageUrl}
                              alt={surah.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />

                            <CardBody style={{ flex: 1 }}>
                              <p>{surah.description}</p>
                            </CardBody>

                            <CardActions>
                              {/* Optional buttons or links */}
                            </CardActions>
                          </Card>

                  ))}
                </div>
                  {open && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      zIndex: 1000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        backgroundColor: 'Khaki',
                        padding: '30px',
                        width: '80%',
                        maxHeight: '80vh',
                        borderRadius: '12px',
                        color: 'black',
                        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}>
                        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Surah Translation</h2>

                        <div style={{
                          flex: 1,
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          padding: '20px',
                          backgroundColor: '#fdf6d3',
                          borderRadius: '8px',
                          fontFamily: 'monospace',
                          fontSize: '16px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                              <Loader type="infinite-spinner" size="large" themeColor="dark" />
                            </div>
                          ) : (  
                          <pre style={{
                            whiteSpace: 'pre-wrap',     
                            wordWrap: 'break-word',     
                            overflowWrap: 'break-word', 
                            fontSize: '16px',
                            lineHeight: '1.6',
                            fontFamily: 'monospace'
                          }}>
                            {surahText}
                          </pre>
                          )}
                        </div>
                        <audio ref={audioRef} src={`/Audios/${surahNumber}.mp3`} />

                            {/* Buttons Row */}
                            <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                              <Button
                                themeColor="primary"
                                size="medium"
                                onClick={() => {
                                  if (audioRef.current) {
                                    if (isPlaying) {
                                      audioRef.current.pause();
                                      setIsPlaying(false);
                                    } else {
                                      audioRef.current.play();
                                      setIsPlaying(true);
                                    }
                                  }
                                }}
                              >
                                {isPlaying ? '⏸️ Pause Recitation' : '▶️ Play Recitation'}
                              </Button></div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                          <Button
                            themeColor="dark"
                            size="medium"
                            onClick={() => {setOpen(false); setIsPlaying(false);}}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}


              </div>
            </TabStripTab>
          

          <TabStripTab title="About">
            <div style={{ padding: '0px'}}>
              <PanelBar style={{ width: '1000px', marginTop: '20px', marginLeft: '180px' }}  className='aboutApp'>
                <PanelBarItem title="About Me">
                      <Avatar
                      shape="circle"
                      style={{
                        width: '200px',
                        height: '200px',
                        marginLeft: '400px',
                        marginTop: '20px',
                        border: '2px solid #60f5f0ff',
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      <img
                        src="/Images/me.jpg"
                        alt="Sumaiya"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Avatar>

                  <BioViewer/>
                </PanelBarItem>

                <PanelBarItem title="About This App" >
                <AppViewer/>  
                </PanelBarItem>

                <PanelBarItem title="Feedback">
                  <form action="https://formspree.io/f/yourFormID" method="POST" onSubmit={() => alert('Thank you! Your feedback has been sent.')}>
                    <TextArea name="message" rows={15} placeholder="Leave your thoughts or reflections..." />
                    <p style={{ fontSize: '1.2em', color: '#ccc', textAlign: 'center' }}>
                      Feedback is sent securely via Formspree. No personal data is stored.
                    </p>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <button type="submit">Submit</button>
                    </div>
                  </form>
                </PanelBarItem>
              </PanelBar>

            </div>
          </TabStripTab>
        </TabStrip>
      </div>
    </div>
  );
};

export default App;
