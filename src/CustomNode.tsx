import React, { useCallback, useState } from 'react';
import { NodeProps, Handle, Position, useReactFlow} from 'reactflow';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CustomNodeData {
  id : string;
  label: React.ReactNode;
  subLabel: React.ReactNode;
  isClicked: boolean;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({data}) => {
  const { label, subLabel, id } = data;
  // const [isSelected, setIsSelected] = useState(false);

  // const handleNodeClick = () => {
  //   setIsSelected(!isSelected);
  // };

  // const onDeleteNode = () => {
  //   // onDelete(id);
  // };

  const { deleteElements } = useReactFlow();

  const onClick = useCallback(() => {
    deleteElements({ nodes: [{ id }] });  
    console.log("delete", id);
  }, [id, deleteElements]);

  return (
    <div className={`custom-node ${data.isClicked ? 'clicked' : ''}`}>
      <div className="node-content">
        {label}
        {subLabel && <div>{subLabel}</div>}
        {data.isClicked && (
          <div className="delete-icon" onClick={onClick}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 !bg-grey-500" />
      <Handle type="source" position={Position.Right} className="w-2 !bg-grey-500" />
      
    </div>
  );
};

export default CustomNode;