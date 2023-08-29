import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  OnConnect,
  MarkerType,
  Position,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';

import './index.css';

import './styles.css';
import NodeDetail from './Nodedetail';

const initialNodes: Node[] = [
  { id: '1', position: { x: 150, y: 250 }, data: {label: ( <> <strong>toy_shop_customers</strong></> ), subLabel: ( <> <i>toy_shop_customers</i></> ) }, style: { border: '2px solid #93eb50', padding: 10 }, sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '2', position: { x: 150, y: 350 }, data: { label: ( <> <strong>orders</strong></> )}, style: { border: '2px solid rgb(28, 145, 69)', padding: 10 }, sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '3', position: { x: 150, y: 450 }, data: { label: ( <> <strong>companies</strong></> )}, style: { border: '2px solid rgb(28, 145, 69)', padding: 10 },sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '4', position: { x: 400, y: 250 }, data: { label: ( <> <strong>orders_per_page</strong></> ) }, style: { border: '2px solid blue', padding: 10 },sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '5', position: { x: 400, y: 350 }, data: { label: ( <> <strong>pending_orders</strong></> )}, style: { border: '2px solid blue', padding: 10 } ,sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '6', position: { x: 600, y: 250 }, data: { label: ( <> <strong>revenue_per_age</strong></> )}, style: { border: '2px solid blue', padding: 10 } ,sourcePosition: Position.Right, targetPosition: Position.Left, },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
];

const nodeColors:{ [key: string]: string } = {
  lightgreen: '#93eb50',
  darkgreen: 'rgb(28, 145, 69)',
  blue: 'blue',
  black: 'black',
};



export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('Anomalies');

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { project } = useReactFlow();

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);


  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onConnectEnd = useCallback(
  (event: React.MouseEvent<HTMLDivElement>) => {
    const targetIsPane =
      event.target && (event.target as HTMLElement).classList.contains('react-flow__pane');

    if (targetIsPane && reactFlowWrapper.current) {
      const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
      const newId = (nodes.length + 1).toString();
      const newNode = {
        id: newId,
        position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
        data: { label: `Node ${newId}` },
      };

      setNodes((nds) => nds.concat(newNode));

      if (connectingNodeId.current) {
        const newEdge = {
          id: `${connectingNodeId.current}-${newId}`, // Provide a unique edge id
          source: connectingNodeId.current,
          target: newId,
        };
        setEdges((eds) => eds.concat(newEdge));
      }
    }
  },
  [project]
);


  const onNodeClick = (_event: React.MouseEvent, clickedNode: Node) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === clickedNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            backgroundColor: 'purple',
            color: 'white',
          },
        };
      } else {
        return {
          ...node,
          style: {
            ...node.style,
            backgroundColor: '',
            color: '',
          },
        };
      }
    });
    const updatedEdges = edges.map((edge) => {
      if (edge.source === clickedNode.id || edge.target === clickedNode.id) {
        return {
          ...edge,
          animated: !edge.animated,
        };
      } else {
        return {
          ...edge,
          animated: false,
        };
      }
    });
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNode(clickedNode);
    setSelectedTab('Anomalies');
  }

  const addNewNode = () => {
    const newNodeId = (nodes.length + 1).toString(); 
    const newNode: Node = {
      id: newNodeId,
      position: { x: 0, y: 0 }, 
      data: { label: <><strong>New Node</strong></> },
      style: { border: '2px solid black', padding: 10 } ,
      sourcePosition: Position.Right, targetPosition: Position.Left,
    };
    setNodes([...nodes, newNode]);
  };

  const filteredNodes = selectedColor ? nodes.filter((node) => node.style?.border === `2px solid ${nodeColors[selectedColor]}`) : nodes;
  const filteredEdges = selectedColor ? edges.filter((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);
    return sourceNode && targetNode && sourceNode.style && targetNode.style &&  sourceNode.style.border === targetNode.style.border;
  }) : edges;
  return (
    <div style={{ display:'flex', width: '90vw', height: '100vh' }}>
    <div className='graph' style={{ width: '100vw', height: '90vh' }}>
      <div className="button-wrapper">
      <button onClick={() => setSelectedColor(null)} className={`button ${selectedColor === null ? 'selected' : ''}`}>
          <span className="color-box" style={{ backgroundColor: 'black' }}></span>
          All Nodes
        </button>
        <button onClick={() => setSelectedColor('lightgreen')} className={`button ${selectedColor === 'lightgreen' ? 'selected' : ''}`}>
          <span className="color-box" style={{ backgroundColor: 'lightgreen' }}></span>
          Source
        </button>
        <button onClick={() => setSelectedColor('darkgreen')} className={`button ${selectedColor === 'darkgreen' ? 'selected' : ''}`}>
          <span className="color-box" style={{ backgroundColor: 'darkgreen' }}></span>
          Seed
        </button>
        <button onClick={() => setSelectedColor('blue')} className={`button ${selectedColor === 'blue' ? 'selected' : ''}`}>
          <span className="color-box" style={{ backgroundColor: 'blue' }}></span>
          Model
        </button>
        <button onClick={addNewNode} className="button">
            Add New Node
          </button>
      </div>
      <ReactFlow
         nodes={filteredNodes}
         edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
      >
        <Controls />
      </ReactFlow>
      
    </div>
    <div className="sidebar">
        <NodeDetail
          selectedNode={selectedNode}
          selectedTab={selectedTab}
          onTabSelect={setSelectedTab} 
        />
      </div>
    </div>
  );
}


