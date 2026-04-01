import type { AgentData, SavedAgent } from '../types/types';

interface SavedAgentProps {
  agent: SavedAgent;
  index: number;
  data: AgentData | null | undefined;
  onLoad: (agent: SavedAgent) => void;
  onDelete: (index: number) => void;
}
export default function SavedAgentCard ({ agent, index, data, onLoad, onDelete }:SavedAgentProps){
    const { name, profileId, skillIds, layerIds, provider } = agent;

    return (
        <div key={index} className='glass' style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #b2ebf2', minWidth: '220px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, color: '#006064' }}>{name}</h3>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Profile:</strong> {data?.agentProfiles.find(p => p.id === profileId)?.name || 'None Selected'}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Skills:</strong> {skillIds?.length || 0} included
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Layers:</strong> {layerIds?.length || 0} included
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Provider:</strong> {provider || 'None'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => onLoad(agent)}
                      style={{ flex: 1, padding: '0.5rem', background: '#00838f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      style={{ padding: '0.5rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
        </div>
    )
}