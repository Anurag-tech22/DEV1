import { useMemo, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

export default function NetGraph() {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gData = useMemo(() => {
    const N = 300;
    const nodes = [...Array(N).keys()].map(i => ({ id: i, val: Math.random() * 10 }));
    const links = [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id - 1))
      }));

    return { nodes, links };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'auto' }}>
      <ForceGraph3D
        graphData={gData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#05050a"
        nodeResolution={16}
        nodeColor={() => 'rgba(59, 130, 246, 0.8)'} // neon blue nodes
        linkColor={() => 'rgba(16, 185, 129, 0.3)'} // emerald links
        linkOpacity={0.3}
        linkWidth={1}
        nodeRelSize={4}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  );
}
