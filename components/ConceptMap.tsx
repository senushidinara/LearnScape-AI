import React from 'react';
import { ConceptMap } from '../types';

interface ConceptMapProps {
  conceptMap: ConceptMap;
}

const ConceptMapCard: React.FC<ConceptMapProps> = ({ conceptMap }) => {
  if (!conceptMap || !conceptMap.nodes || conceptMap.nodes.length === 0) {
    return null;
  }
  
  const { nodes, edges } = conceptMap;

  const padding = 15;
  const minX = Math.min(...nodes.map(n => n.x)) - padding;
  const minY = Math.min(...nodes.map(n => n.y)) - padding;
  const maxX = Math.max(...nodes.map(n => n.x)) + padding;
  const maxY = Math.max(...nodes.map(n => n.y)) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  const findNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Concept Map</h2>
      <div className="aspect-video w-full bg-gray-900/30 rounded-lg overflow-hidden">
        <svg viewBox={`${minX} ${minY} ${width} ${height}`} className="w-full h-full">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9.5"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,3.5 L0,7 z" fill="#6b7280" />
            </marker>
          </defs>

          {edges.map((edge, index) => {
            const fromNode = findNode(edge.from);
            const toNode = findNode(edge.to);
            if (!fromNode || !toNode) return null;

            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            return (
              <g key={`edge-${index}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#6b7280"
                  strokeWidth="0.5"
                  markerEnd="url(#arrowhead)"
                />
                {edge.label && (
                    <text x={midX} y={midY} fill="#d1d5db" fontSize="3" textAnchor="middle" dy="-1" paintOrder="stroke" stroke="#1e293b" strokeWidth="0.5px" strokeLinecap="butt" strokeLinejoin="miter">
                        {edge.label}
                    </text>
                )}
              </g>
            );
          })}
          
          {nodes.map(node => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle r="8" fill="#1f2937" stroke="#8b5cf6" strokeWidth="0.7" />
              <text
                textAnchor="middle"
                dy="1.5"
                fill="white"
                fontSize="4"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
            </g>
          ))}

        </svg>
      </div>
    </div>
  );
};

export default ConceptMapCard;
