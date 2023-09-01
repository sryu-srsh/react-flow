import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  MarkerType,
  Position,
  useReactFlow,
  updateEdge,
  Connection,
  getConnectedEdges,
  getIncomers,
  getOutgoers
} from 'reactflow';

import 'reactflow/dist/style.css';
import './index.css';
import './styles.css';

import NodeDetail from './Nodedetail';
import CustomNode from './CustomNode';

const nodeTypes = {
  customNode: CustomNode, 
};

const initialNodes: Node[] = [
  { id: '1', type: 'customNode', position: { x: 150, y: 250 }, data: {label: ( <> <strong>toy_shop_customers</strong></> ), subLabel: ( <> <i>toy_shop_customers</i></> ) }, style: { border: '2px solid #93eb50', padding: 8, borderRadius:'10px' }, sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '2', type: 'customNode', position: { x: 150, y: 350 }, data: { label: ( <> <strong>orders</strong></> ), subLabel: ( <> <i>orders</i></> ) },  style: { border: '2px solid rgb(28, 145, 69)', padding: 8, borderRadius:'10px' }, sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '3', type: 'customNode', position: { x: 150, y: 450 }, data: { label: ( <> <strong>companies</strong></> ), subLabel: ( <> <i>customers</i></> ) }, style: { border: '2px solid rgb(28, 145, 69)', padding: 8, borderRadius:'10px' },sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '4', type: 'customNode', position: { x: 400, y: 250 }, data: { label: ( <> <strong>orders_per_page</strong></> ), subLabel: ( <> <i>customers</i></> )  }, style: { border: '2px solid blue', padding: 8, borderRadius:'10px' },sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '5', type: 'customNode', position: { x: 400, y: 350 }, data: { label: ( <> <strong>pending_orders</strong></> ), subLabel: ( <> <i>customers</i></> ) }, style: { border: '2px solid blue', padding: 8, borderRadius:'10px' } ,sourcePosition: Position.Right, targetPosition: Position.Left, },
  { id: '6', type: 'customNode', position: { x: 600, y: 250 }, data: { label: ( <> <strong>revenue_per_age</strong></> ), subLabel: ( <> <i>revenue</i></> ) }, style: { border: '2px solid blue', padding: 8, borderRadius:'10px' } ,sourcePosition: Position.Right, targetPosition: Position.Left, },
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

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  const onConnectStart: OnConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []); 

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
  (event:any) => {
    const targetIsPane =
      event.target && (event.target as HTMLElement).classList.contains('react-flow__pane');

      if (targetIsPane && reactFlowWrapper.current) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = (nodes.length + 1).toString();
        const position = project({
          x: event.clientX - left - 75,
          y: event.clientY - top,
        });
        const newNode = {
          id,
          type: 'customNode',
          position,
          data: { label: <><strong>New Node</strong></> },
      style: { border: '2px solid black', padding: 10 } ,
      sourcePosition: Position.Right, targetPosition: Position.Left,
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        if (connectingNodeId.current) {
          const newEdge = {
            id: `${connectingNodeId.current}-${id}`,
            source: connectingNodeId.current,
            target: id,
          };
      
          setEdges((eds) => [...eds, newEdge]);
        }
      
      }
  },
  [project, nodes, connectingNodeId]
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
          isClicked: true, 
        };
      } else {
        const initialNode = initialNodes.find(initialNode => initialNode.id === node.id);

    if (initialNode) {
      return {
        ...node,
        style: {
          ...initialNode.style, // Reset the style to its initial values
        },
        isClicked: false,
      };
    } else {
      return node;
    }
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
      type: 'customNode',
      position: { x: 0, y: 0 }, 
      data: { label: <><strong>New Node</strong></> },
      style: { border: '2px solid black', padding: 10 } ,
      sourcePosition: Position.Right, targetPosition: Position.Left,
    };
    setNodes([...nodes, newNode]);
  };

  const onNodesDelete = useCallback(
    (deleted: any[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge: Edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const filteredNodes = selectedColor ? nodes.filter((node) => node.style?.border === `2px solid ${nodeColors[selectedColor]}`) : nodes;
  const filteredEdges = selectedColor ? edges.filter((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);
    return sourceNode && targetNode && sourceNode.style && targetNode.style &&  sourceNode.style.border === targetNode.style.border;
  }) : edges;
  return (
    <div style={{ display:'flex', width: '90vw', height: '100vh' }}  ref={reactFlowWrapper}>
    <div className='max-w-3xl' style={{ width: '100vw', height: '90vh' }}>
      <div className="flex">
      <button onClick={() => setSelectedColor(null)} className={`flex items-center font-bold text-lg py-2 px-4 rounded-full mr-4 border-b-2 border-transparent cursor-pointer ${selectedColor === null ? 'border-b-3 border-purple-600' : ''}`}>
          <span className="w-5 h-5 ml-2 rounded-sm mr-1 bg-black"></span>
          All Nodes
        </button>
        <button onClick={() => setSelectedColor('lightgreen')} className={`flex items-center font-bold text-lg py-2 px-4 rounded-full mr-4 cursor-pointer ${selectedColor === 'lightgreen' ? 'border-b-3 border-purple-600' : 'border-b-2 border-transparent'}`}>
          <span className="w-5 h-5 rounded-sm mr-1 bg-lightgreen"></span>
              Source
        </button>
        <button onClick={() => setSelectedColor('darkgreen')} className={`flex items-center font-bold text-lg py-2 px-4 rounded-full mr-4 border-b-2 border-transparent cursor-pointer ${selectedColor === 'darkgreen' ? 'border-b-3 border-purple-600' : ''}`}>
          <span className="w-5 h-5 ml-2 rounded-sm mr-1 bg-darkgreen"></span>
          Seed
        </button>
        <button onClick={() => setSelectedColor('blue')} className={`flex items-center font-bold text-lg py-2 px-4 rounded-full mr-4 border-b-2 border-transparent cursor-pointer ${selectedColor === 'blue' ? 'border-b-3 border-purple-600' : ''}`}>
          <span className="w-5 h-5 ml-2 rounded-sm mr-1 bg-blue"></span>
          Model
        </button>
        <button onClick={addNewNode} className="flex items-center font-bold text-lg py-2 px-4 rounded-full mr-4 border-b-2 border-transparent cursor-pointer">
            Add New Node
          </button>
      </div>
      <ReactFlow
      nodeTypes={nodeTypes}
      nodes={filteredNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isClicked: node.id === selectedNode?.id, 
        },
      }))}
         edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        onEdgeUpdate={onEdgeUpdate}
      ><Controls />
      </ReactFlow>
      
    </div>
    <div className="border-l-2 pl-5 max-w-xl">
        <NodeDetail
          selectedNode={selectedNode}
          selectedTab={selectedTab}
          onTabSelect={setSelectedTab} 
        />
      </div>
    </div>
  );
}
