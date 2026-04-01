import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";

export default function ParticlesComponent (){
    const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    fpsLimit: 120,
    particles: {
      color: { value: "#ffffff" },
      links: { 
        enable: true, 
        distance: 150, 
        color: "#ffffff", 
        opacity: 0.5, 
        width: 1 
      },
      move: { 
        enable: true, 
        speed: 2, 
        outModes: { default: "bounce" } 
      },
      number: { value: 80 }
    }
  }), [])
    if (!init) return null;

  return <Particles id="tsparticles" options={options} />;
}