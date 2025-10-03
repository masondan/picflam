import './SaveDrawer.css';
import { FiCheck } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

function SaveDrawer({
  onClose,
  savedProjects,
  onSave,
  onLoad,
  onDelete,
}) {
  const slots = [0, 1, 2];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content save-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title flex-grow">Save/Load</span>
          <button className="drawer-header-button" onClick={onClose}><FiCheck /></button>
        </div>
        <div className="drawer-body">
          <div className="save-slots-container">
            {slots.map((index) => {
              const project = savedProjects[index];
              return (
                <div key={index} className="save-slot">
                  {project ? (
                    <div className="save-slot-saved">
                      <div
                        className="save-slot-thumbnail"
                        style={{ backgroundImage: `url(${project.thumbnail})` }}
                        onClick={() => onLoad(index)}
                        title={`Load Project ${index + 1}`}
                      />
                      <button className="delete-project-button" onClick={() => onDelete(index)} title="Delete Project">
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <button className="save-slot-button" onClick={() => onSave(index)}>
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="save-drawer-warning">Saved projects may be lost if cache is cleared.</p>
        </div>
      </div>
    </div>
  );
}

export default SaveDrawer;
