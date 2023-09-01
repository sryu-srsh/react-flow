

import React, { useState, memo, useCallback } from 'react';
import { NodeProps, Handle, Position, useReactFlow} from 'reactflow';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomNode = ({
  id,
  data,
  isConnectable,
  targetPosition = Position.Left,  
  sourcePosition = Position.Right
}: NodeProps) => {
  const { deleteElements } = useReactFlow();

  const onClick = useCallback(() => {    
    deleteElements({ nodes: [{ id }] });  
  }, [id, deleteElements]);

  return (    
  <>      <Handle type="target"        position={targetPosition}        isConnectable={isConnectable} />      
  <button onClick={onClick}>Click to delete me</button>      
  <Handle        type="source"        position={sourcePosition}        isConnectable={isConnectable}      />    
  </>  );
}

CustomNode.displayName = "CustomNode";
export default memo(CustomNode);