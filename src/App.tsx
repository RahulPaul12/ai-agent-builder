import { useState, useEffect, useMemo } from 'react'
import type  { AgentData, SavedAgent } from '../types/types'
import Loader from '../components/Loader'
import SavedAgentCard from '../components/SavedAgentCard'
import SelectedListComponent from '../components/SelectedListComponent'
import Select from 'react-select'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

function App() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selection states
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])

 
  // Saving states
  const [agentName, setAgentName] = useState('')
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  const [sessionTime, setSessionTime] = useState(0)


  const handleDeleteAgent = (indexToRemove: number) => {
    const updatedAgents = savedAgents.filter((_, index) => index !== indexToRemove)
    setSavedAgents(updatedAgents)
    localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load saved agents from local storage on component mount
    const saved = localStorage.getItem('savedAgents')
    if (saved) {
      try {
        setSavedAgents(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved agents', e)
      }
    }
  }, [])

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentName !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${agentName}"`)
      } else {
        console.log(`[Analytics Heartbeat] User is working on an unnamed agent draft...`)
      }
    }, 8000)

    return () => clearInterval(analyticsInterval)
  }, [])

  const fetchAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate network delay and randomness (1 to 3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to fetch agent data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on initial component mount
  useEffect(() => {
    fetchAPI()
  }, [])

  const handleLayerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layerId = e.target.value;
    if (layerId && !selectedLayers.includes(layerId)) {
      setSelectedLayers([...selectedLayers, layerId])
    }
    e.target.value = ""; // Reset dropdown

    fetchAPI()
  }
 
  const handleSkillSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const skillId = e.target.value;
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    e.target.value = ""; // Reset dropdown

    fetchAPI()
  }

  const handleSaveAgent = () => {
    if (!agentName.trim()) {
      alert('Please enter a name for your agent.')
      return
    }

    const newAgent: SavedAgent = {
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    }

    const updatedAgents = [...savedAgents, newAgent]
    setSavedAgents(updatedAgents)
    localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))
    setAgentName('')
    alert(`Agent "${newAgent.name}" saved successfully!`)
  }

  const handleLoadAgent = (agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills(agent.skillIds || [])
    setSelectedLayers([...(agent.layerIds || [])])
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
  }

  return (
    
    <>
    
    {loading && (      
       <Loader/>     
    )}

    <div className='container'>

       <div className="mb-8 card-enter">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl sperk">✦</div>
          <h1 className="font-display text-3xl heading">Agent Builder</h1>
        </div>
        <p className="text-sm ml-14 font-body text-white" >Design your custom AI personality &amp; capability set ✨</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="relative flex justify-center items-center size-12">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6C63FF] opacity-75"></span>
          <span className="relative inline-flex justify-center items-center size-10 rounded-full glass">
          <span id="timer-display" className="font-display text-sm" >{sessionTime}</span>
          </span>
        </span>
        <button onClick={fetchAPI} disabled={loading} id="reload-btn" className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display text-sm animated-gradient-button">
          <span id="reload-icon" className={` ${loading? 'animate-rotate':''}`}>⟳</span>{loading ? 'Fetching' : 'Reload'}
        </button>
      </div>
    </div>
  </div>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row' }}>
          {/* Left pane: Selections */}
          <section className='glass' style={{ flex: '1 1 50%', borderRight: '1px solid #ccc', padding: '1rem' }}>
            <h2>Configuration Options</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}
            

            {!data && !loading && !error && <p>No data loaded.</p>}

            {data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="profile-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Base Profile:</label>
                  <select
                    id="profile-select"
                    value={selectedProfile}
                    onChange={(e) => {
                      setSelectedProfile(e.target.value)
                      fetchAPI()
                    }}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="">-- Select a Profile --</option>
                    {data.agentProfiles.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  

                </div>

                <div>
                  <label htmlFor="skill-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Skill:</label>
                  <select
                    id="skill-select"
                    onChange={handleSkillSelect}
                    defaultValue=""
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="" disabled>-- Select a Skill to Add --</option>
                    {data.skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="layer-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Personality Layer:</label>
                  <select
                    id="layer-select"
                    onChange={handleLayerSelect}
                    defaultValue=""
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="" disabled>-- Select a Layer to Add --</option>
                    {data.layers.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="provider-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Provider:</label>
                  <select
                    id="provider-select"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="">-- Select an AI Provider --</option>
                    {['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'].map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </section>

          {/* Right pane: Selected configuration preview */}
          <section className='glass p-4' style={{ flex: '1 1 50%',}}>
            <h2>Current Agent Configuration</h2>

            <div style={{  borderRadius: '8px', minHeight: '300px' }}>
              <h3 style={{ marginTop: 0 }}>Profile</h3>
              {selectedProfile && data ? (
                <p>
                  <strong>{data.agentProfiles.find(p => p.id === selectedProfile)?.name}</strong>:
                  {' '}{data.agentProfiles.find(p => p.id === selectedProfile)?.description}
                </p>
              ) : (
                <p style={{ color: '#888' }}>No profile selected.</p>
              )}

              <SelectedListComponent 
                  title="Skills"
                  selectedIds={selectedSkills}
                  allData={data?.skills}
                  onRemove={(id) => setSelectedSkills(prev => prev.filter(s => s !== id))}
              />
              <SelectedListComponent 
                  title="Layers"
                  selectedIds={selectedLayers}
                  allData={data?.layers}
                  onRemove={(id) => setSelectedLayers(prev => prev.filter(s => s !== id))}
              />

              <h3>Selected Provider</h3>
              {selectedProvider ? (
                <p className="glass w-fit! px-2 py-1 mt-2"><strong>{selectedProvider}</strong></p>
              ) : (
                <p style={{ color: '#888' }}>No provider selected.</p>
              )}

              <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>Save This Agent</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter agent name..."
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem' }}
                  />
                  <button onClick={handleSaveAgent} style={{ padding: '0.5rem 1rem' }} className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display text-sm animated-gradient-button">
                    Save Agent
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Panel: Saved Agents */}
        {savedAgents.length > 0 && (
          <section className='glass' style={{ padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Saved Agents</h2>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all saved agents?')) {
                    setSavedAgents([])
                    localStorage.removeItem('savedAgents')
                  }
                }}
                style={{ padding: '0.5rem 1rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {savedAgents.map((agent, index) => (
                <SavedAgentCard key={index} agent={agent} index={index} onLoad={handleLoadAgent} onDelete={handleDeleteAgent} data={data}/>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
    </>
  )
}

export default App
