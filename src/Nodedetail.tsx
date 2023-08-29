import React, { ReactNode } from 'react';

interface NodeDetailProps {
  selectedNode: any; // Change 'any' to the appropriate type for your selected node data
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ selectedNode, selectedTab, onTabSelect }) => {
  let content: ReactNode = null;

  if (selectedNode) {
    switch (selectedTab) {
      case 'Anomalies':
        content = <div className='node-data'>Display Anomalies Data for {selectedNode.data.label}</div>;
        break;
      case 'Tests':
        content = <div className='node-data'>Display Tests Data for {selectedNode.data.label}</div>;
        break;
      case 'Metrics':
        content = <div className='node-data'>Display Metrics Data for {selectedNode.data.label}</div>;
        break;
      case 'Schema':
        content = <div className='node-data'>Display Schema Data for {selectedNode.data.label}</div>;
        break;
      default:
        content = null;
    }
  }

  return (
    <div className="node-detail">
      <div className="button-wrapper">
        <button onClick={() => onTabSelect('Anomalies')} className={`button ${selectedTab === 'Anomalies' ? 'selected' : ''}`}>Anomalies</button>
        <button onClick={() => onTabSelect('Tests')} className={`button ${selectedTab === 'Tests' ? 'selected' : ''}`}>Tests</button>
        <button onClick={() => onTabSelect('Metrics')} className={`button ${selectedTab === 'Metrics' ? 'selected' : ''}`}>Metrics</button>
        <button onClick={() => onTabSelect('Schema')} className={`button ${selectedTab === 'Schema' ? 'selected' : ''}`}>Schema</button>
      </div>
      {selectedNode ? (
        <div className="selected-data">{content}</div>
      ) : (
        <div className="no-node-selected">
            <p>Click on node to show metrics, anomalies or schema changes</p>
            <ul>
                <li>You can click on the graph legend (source, seed, anomaly..) to toggle showing only specific nodes.</li>
            </ul>
        </div>
      )}
    </div>
  );
};

export default NodeDetail;
