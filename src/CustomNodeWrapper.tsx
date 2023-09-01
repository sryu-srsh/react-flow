import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NodeProps } from "reactflow";
import CustomNode from "./CustomNode";

interface CustomNodeData {
    id: JSX.Element;
    label: JSX.Element;
    subLabel?: JSX.Element;
  }

const CustomNodeWrapper: React.FC<NodeProps<CustomNodeData>> = ({ id, data, onDelete, ...rest }) => {
    const handleDelete = () => {
      onDelete(id);
    };
  
    return (
      <div>
        <CustomNode id={id} data={data} {...rest} />
        <div className="delete-icon" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    );
  };

  export default CustomNodeWrapper;
  