import React, { memo, useCallback, useState } from 'react';
import { NodeProps, Handle, Position, useReactFlow} from 'reactflow';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomNode = ({
  id,
  data
}: NodeProps) => {
  const reactFlowInstance = useReactFlow();

  const onClick = useCallback(() => {
    reactFlowInstance.deleteElements({ nodes: [{ id }] });
    console.log("delete");
  }, [id, reactFlowInstance]);

  return (
    <>
    <div className={`custom-node ${data.isClicked ? 'clicked' : ''}`}>
      <div className="node-content">
        {data.label}
        {data.subLabel && <div>{data.subLabel}</div>}
        {data.isClicked && (
          <div className="delete-icon" onClick={onClick}>
            <FontAwesomeIcon icon={faTrash} />
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 !bg-grey-500" />
      <Handle type="source" position={Position.Right} className="w-2 !bg-grey-500" />
      
    </div>
    </>
  );
};

// interface CustomNodeData {
//   id : React.ReactNode;
//   label: React.ReactNode;
//   subLabel: React.ReactNode;
//   isClicked: boolean;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({id , data}) => {
//   const { label, subLabel } = data;
//   // const [isSelected, setIsSelected] = useState(false);

//   // const handleNodeClick = () => {
//   //   setIsSelected(!isSelected);
//   // };

//   // const onDeleteNode = () => {
//   //   // onDelete(id);
//   // };

//   const { deleteElements } = useReactFlow();

//   const onClick = useCallback((id: string) => {
//     deleteElements({ nodes: [{ id }] })  
//     console.log("delete", id);
//   }, [id, deleteElements]);

//   return (
//     <div className={`custom-node ${data.isClicked ? 'clicked' : ''}`}>
//       <div className="node-content">
//         {label}
//         {subLabel && <div>{subLabel}</div>}
//         {data.isClicked && (
//           <div className="delete-icon"  onClick={() => onClick(id)}>
//             <FontAwesomeIcon icon={faTrash} />
//           </div>
//         )}
//       </div>
//       <Handle type="target" position={Position.Left} className="w-2 !bg-grey-500" />
//       <Handle type="source" position={Position.Right} className="w-2 !bg-grey-500" />
      
//     </div>
//   );
// };

CustomNode.displayName = "CustomNode";

export default memo(CustomNode);