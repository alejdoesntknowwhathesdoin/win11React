import React, { useState, useEffect } from 'react';
import './style.css';

const Store = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // grid or list
  const [selectedApp, setSelectedApp] = useState(null);
  const [installedApps, setInstalledApps] = useState([]);

  useEffect(() => {
    // Fetch from your local JSON
    fetch('/store/index.json')
      .then((response) => response.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading store:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Load installed apps from localStorage
    const stored = localStorage.getItem('installedApps') || '[]';
    setInstalledApps(JSON.parse(stored));
  }, []);

  const installApp = (app) => {
    const updated = [...installedApps, app.name];
    setInstalledApps(updated);
    localStorage.setItem('installedApps', JSON.stringify(updated));
    alert(`${app.name} installed! Find it in Start Menu.`);
  };

  const uninstallApp = (appName) => {
    const updated = installedApps.filter((name) => name !== appName);
    setInstalledApps(updated);
    localStorage.setItem('installedApps', JSON.stringify(updated));
    alert(`${appName} uninstalled.`);
  };

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="store-loading">Loading Microsoft Store...</div>;
  }

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Microsoft Store</h1>
        <input
          type="text"
          placeholder="Search apps and games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="store-search"
        />
        <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
          {view === 'grid' ? 'List View' : 'Grid View'}
        </button>
      </div>

      <div className={`store-apps ${view}`}>
        {filteredApps.map((app) => (
          <div key={app.name} className="store-app-card">
            <img src={app.icon} alt={app.name} className="store-icon" />
            <h3>{app.name}</h3>
            <p>{app.data.desc}</p>
            <ul>
              {app.data.feat.split('\n').map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
            {app.data.gallery && (
              <div className="store-gallery">
                {app.data.gallery.slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i + 1}`} />
                ))}
              </div>
            )}
            {installedApps.includes(app.name) ? (
              <button onClick={() => uninstallApp(app.name)}>Uninstall</button>
            ) : (
              <button onClick={() => installApp(app)}>Install</button>
            )}
          </div>
        ))}
      </div>

      {selectedApp && (
        <div className="store-modal">
          <h2>{selectedApp.name}</h2>
          {/* Add more details here if needed */}
          <button onClick={() => setSelectedApp(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Store;
