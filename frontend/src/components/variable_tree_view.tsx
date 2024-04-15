import { useState } from "react";
import React from "react";
import { VarNode } from "@/types/environment";

const CHILDREN_DISP_LIMIT = 50;

function VarTreeNode({
  node,
  onUpdate,
}: {
  node: VarNode;
  onUpdate: (tree_path: string, key: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to trigger when name or description is edited
  const handleUpdate = (key: string, value: string) => {
    onUpdate(node.tree_path, key, value);
  };

  // Toggle the visibility of child nodes
  const toggleChildrenVisibility = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <div>
        <table className="table table-zebra">
          <tbody>
            <tr>
              <td>
                {node.children && node.children.length > 0 ? (
                  <button onClick={toggleChildrenVisibility} className="btn">
                    {isOpen ? "-" : "+"}
                  </button>
                ) : (
                  <div className="btn bg-transparent outline-none"> </div>
                )}
              </td>
              <td>
                <EditableField
                  value={node.name ?? ""}
                  onValueChange={(value: string) => handleUpdate("name", value)}
                  valueName="Variable Name"
                />
              </td>
              <td>
                <EditableField
                  value={node.description ?? ""}
                  onValueChange={(value: string) =>
                    handleUpdate("description", value)
                  }
                  valueName="Variable Description"
                />
              </td>
              <td>{node.spec}</td>
            </tr>
          </tbody>
        </table>

        {node.children && node.children.length > CHILDREN_DISP_LIMIT && (
          <div>
            The number of child variables is over the display limit{" "}
            {CHILDREN_DISP_LIMIT}.
          </div>
        )}
      </div>
      {isOpen &&
        node.children &&
        node.children.length <= CHILDREN_DISP_LIMIT && (
          <div className="pl-4">
            {node.children.map((child) => (
              <VarTreeNode key={child.path} node={child} onUpdate={onUpdate} />
            ))}
          </div>
        )}
    </div>
  );
}

// Component for editable text fields
const EditableField = ({
  value,
  onValueChange,
  valueName,
}: {
  value: string;
  onValueChange: (value: string) => void;
  valueName: string;
}) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <input
      type="text"
      placeholder={`Enter ${valueName}`}
      readOnly={!editMode}
      className="input input-bordered"
      defaultValue={value}
      onClick={() => setEditMode(true)}
      onBlur={(event) => {
        setEditMode(false);
        if (event.target.value !== value) {
          onValueChange(event.target.value);
        }
      }}
    />
  );
};

export default function VarTreeView({
  title,
  rootNode: root,
  setRootNode: setRoot,
}: {
  title: string;
  rootNode: VarNode;
  setRootNode: React.Dispatch<React.SetStateAction<VarNode>>;
}) {
  const updateNode = (tree_path: string, key: string, value: string) => {
    const paths = tree_path.split("/").slice(1).map(Number);
    const recursiveUpdate = (
      node: VarNode,
      paths: number[],
      key: string,
      value: string
    ): VarNode => {
      if (paths.length === 0) {
        return { ...node, [key]: value };
      }
      const newChildren = node.children.map((child, idx) => {
        if (idx === paths[0]) {
          return recursiveUpdate(child, paths.slice(1), key, value);
        }
        return child;
      });
      return { ...node, children: newChildren };
    };
    let newRootNode = recursiveUpdate(root, paths, key, value);
    setRoot(newRootNode);
  };

  return (
    <div className="card bg-base-100 bordered">
      <div className="card-body">
        <div className="card-title">{title}</div>
        <VarTreeNode node={root} onUpdate={updateNode} />
      </div>
    </div>
  );
}
