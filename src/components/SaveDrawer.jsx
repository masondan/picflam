import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import './SaveDrawer.css';

function SaveDrawer({ onClose, savedProjects, onSave, onLoad, onDelete }) {
  const slots = [0, 1, 2];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content save-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={onClose}>
            <FiX />
          </button>
          <span className="drawer-title">Save / Load Project</span>
          <div className="drawer-header-button" />
        </div>
        <div className="drawer-body">
          <div className="save-slots-container">
            {slots.map((slotIndex) => {
              const project = savedProjects[slotIndex];
              return (
                <div key={slotIndex} className="save-slot">
                  <div
                    className="save-slot-thumbnail"
                    onClick={() => (project ? onLoad(slotIndex) : onSave(slotIndex))}
                    style={{ backgroundImage: project ? `url(${project.thumbnail})` : 'none' }}
                  >
                    {!project && <FiPlus size={48} color="#ccc" />}
                  </div>
                  {project && (
                    <button className="delete-project-button" onClick={() => onDelete(slotIndex)} title="Delete Project"><FiTrash2 /></button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="save-drawer-warning">Saved projects may be lost if browser cache is cleared.</p>
        </div>
      </div>
    </div>
  );
}

export default SaveDrawer;