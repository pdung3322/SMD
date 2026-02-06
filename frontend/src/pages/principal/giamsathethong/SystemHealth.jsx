import React, { useState, useEffect } from 'react';
import { 
  Activity, Server, Cpu, Zap, 
  RefreshCcw, Clock, ShieldCheck, Terminal
} from 'lucide-react';
import './SystemHealth.css';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState({
    apiStatus: 'checking',
    aiService: { status: 'loading', queue: 0 },
    requestsToday: 0,
    lastUpdated: new Date().toLocaleTimeString()
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const fetchSystemHealth = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setHealthData({
        apiStatus: 'healthy',
        aiService: { status: 'running', queue: Math.floor(Math.random() * 10) },
        requestsToday: 8420 + Math.floor(Math.random() * 50),
        lastUpdated: new Date().toLocaleTimeString()
      });
      setIsSyncing(false);
    }, 800);
  };

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="system-monitor-v2">
      {/* Header Profile & Title */}
      <div className="monitor-header-v2">
        <div className="title-area">
          <div>
            <h2>Hệ thống Giám sát SMD</h2>
          </div>
        </div>
        <div className="sync-area">
          <div className="time-badge">
            <Clock size={14} /> <span>{healthData.lastUpdated}</span>
          </div>
          <button className={`btn-sync ${isSyncing ? 'is-loading' : ''}`} onClick={fetchSystemHealth}>
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid-stats">
        {/* Card 1: API */}
        <div className="stat-card-v2">
          <div className="card-top">
            <div className="card-label"><Server size={18} /> API GATEWAY</div>
            <div className={`status-dot-v2 ${healthData.apiStatus}`}></div>
          </div>
          <div className="card-value">
            <span className="value-text">{healthData.apiStatus === 'healthy' ? 'CONNECTED' : 'CHECKING'}</span>
            <span className="sub-value">Latency: 18ms</span>
          </div>
          <div className="progress-mini"><div className="fill green" style={{width: '100%'}}></div></div>
        </div>

        {/* Card 2: AI SERVICE */}
        <div className="stat-card-v2">
          <div className="card-top">
            <div className="card-label"><Zap size={18} /> AI ENGINE</div>
            <span className="badge-ai">Running</span>
          </div>
          <div className="card-value">
            <div className="queue-display">
              <span className="num">{healthData.aiService.queue}</span>
              <span className="unit">Pending Requests</span>
            </div>
          </div>
          <div className="progress-mini"><div className="fill purple" style={{width: '40%'}}></div></div>
        </div>

        {/* Card 3: TRAFFIC */}
        <div className="stat-card-v2">
          <div className="card-top">
            <div className="card-label"><Activity size={18} /> TRAFFIC</div>
          </div>
          <div className="card-value">
            <span className="value-text">{healthData.requestsToday.toLocaleString()}</span>
            <span className="sub-value">Total Hits Today</span>
          </div>
          <div className="progress-mini"><div className="fill blue" style={{width: '75%'}}></div></div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="terminal-v2">
        <div className="terminal-head">
          <Terminal size={14} /> <span>SYSTEM HEARTBEAT LOG</span>
        </div>
        <div className="terminal-content">
          <p><span>[{healthData.lastUpdated}]</span> [SYS] API Handshake successful (200 OK)</p>
          <p><span>[{healthData.lastUpdated}]</span> [AI] VectorDB re-indexed successfully</p>
          <p className="active-line"><span>[{healthData.lastUpdated}]</span> [SYNC] Fetching health data from cluster...</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;