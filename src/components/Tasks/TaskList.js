import React, { useEffect, useState } from "react";
import API from "../../api";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";

// Buttons for filtering tasks by status
const STATUS_BUTTONS = [
  { label: "All", value: "All" },
  { label: "ToDo", value: "To Do" },
  { label: "InProgress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

// Allowed statuses for moving tasks (single or bulk)
const MOVE_STATUSES = ["To Do", "In Progress", "Completed"];

export default function TaskList({ showHelp, setShowHelp }) {
  // State variables to hold tasks, filters, search terms, forms and UI states
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState([]);

  // Fetch all tasks from backend API
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  // Fetch tasks once component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task via the API
  const addTask = async (task) => {
    setIsSaving(true);
    try {
      await API.post("/tasks", task);
      toast.success("Task added successfully!");
      fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error("Add task error:", error);
      toast.error("Unable to add task at this moment. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update an existing task via the API
  const updateTask = async (updatedTask) => {
    if (!taskToEdit) return;
    setIsSaving(true);
    try {
      await API.put(`/tasks/${taskToEdit._id}`, updatedTask);
      toast.success("Task updated successfully!");
      setTaskToEdit(null);
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error("Update task error:", error);
      toast.error("Unable to update task at this moment. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a task via the API
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Unable to delete task at this moment. Please try again later.");
    }
  };

  // Move a single task to a new status
  const moveTaskStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task moved to ${newStatus}`);
      fetchTasks();
    } catch (error) {
      console.error("Move task status error:", error);
      toast.error("Failed to move task");
    }
  };

  // Move all filtered tasks to new status (bulk operation)
  const moveAllTasksStatus = async (newStatus) => {
    try {
      const filteredIds = filteredTasks.map((task) => task._id);
      for (const id of filteredIds) {
        await API.put(`/tasks/${id}`, { status: newStatus });
      }
      toast.success(`All filtered tasks moved to ${newStatus}`);
      fetchTasks();
    } catch (error) {
      console.error("Bulk move tasks error:", error);
      toast.error("Failed to move all tasks");
    }
  };

  // Filter tasks based on current filterStatus and searchTerm
  const filteredTasks = tasks.filter((task) => {
    const matchStatus = filterStatus === "All" || task.status === filterStatus;
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Open form for adding a new task
  const openAddForm = () => {
    setTaskToEdit(null);
    setShowForm(true);
  };

  // Open form for editing a selected task
  const openEditForm = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  // Close task form modal
  const closeForm = () => {
    setTaskToEdit(null);
    setShowForm(false);
  };

  // Map priority string to Bootstrap badge color classes
  const priorityBadge = (priority) => {
    if (priority === "High") return "danger";
    if (priority === "Medium") return "warning";
    return "info";
  };

  // Helper to truncate long text with ellipsis
  function truncateText(text, length = 120) {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  }

  return (
    <div>
      {/* Header section with Create Task button */}
      <div
        className="pb-3"
        style={{
          position: "sticky",
          top: "2px",
          zIndex: 1020,
          background: "linear-gradient(135deg, #191a1c 0%, #396864 100%)",
        }}
      >
        <div className="d-flex justify-content-center align-items-center my-3">
          <div className="d-flex flex-column flex-md-row gap-2">
            <button
              className="btn btn-primary me-2"
              style={{ fontSize: "1.2rem", padding: "12px 32px", fontWeight: 600 }}
              onClick={openAddForm}
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Filters, search bar and bulk move dropdown */}
        <div className="d-flex flex-column flex-md-row justify-content-center mb-3 gap-2 align-items-center">
          {/* Status filter buttons */}
          <div className="d-flex flex-row gap-2 flex-wrap">
            {STATUS_BUTTONS.map((btn) => (
              <button
                key={btn.value}
                className={`btn ${filterStatus === btn.value ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setFilterStatus(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 250 }}
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Batch move dropdown shown only if tasks exist */}
          {filteredTasks.length > 0 && (
            <Dropdown as="div">
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{ marginLeft: "10px" }}
                disabled={filteredTasks.length === 0}
              >
                Move All
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {MOVE_STATUSES.filter((status) => status !== filterStatus).map((status) => (
                  <Dropdown.Item key={status} onClick={() => moveAllTasksStatus(status)}>
                    Move All to {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <div />
        </div>
      </div>

      {/* Task list or empty message */}
      {filteredTasks.length === 0 ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center mt-5 p-4 rounded"
          style={{
            height: "60vh",
            backgroundColor: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.4rem",
            fontWeight: "500",
          }}
        >
          <p className="mb-3">
            {filterStatus === "All"
              ? "You don't have any tasks yet."
              : `No tasks found for "${filterStatus}" status.`}
          </p>
          <button className="btn btn-primary btn-lg" onClick={openAddForm}>
            Create your first task
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {/* Render each task card */}
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border rounded p-3 shadow-sm"
              style={{ background: "#eaeceeff", position: "relative" }}
            >
              {/* Title and priority badge */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
                    Title :{task.title}
                  </span>
                </div>
                <span className={`badge bg-${priorityBadge(task.priority)}`} style={{ fontSize: "0.95rem" }}>
                  {task.priority}
                </span>
              </div>

              {/* Description with toggle for long text */}
              <div className="text-muted mt-2" style={{ fontSize: "1rem" }}>
                Description :-&nbsp;
                {task.description && task.description.length > 120 && !expandedTaskIds.includes(task._id) ? (
                  <>
                    {truncateText(task.description, 120)}
                    <span
                      style={{ cursor: "pointer", color: "#007bff", marginLeft: "5px", fontWeight: 500 }}
                      onClick={() => setExpandedTaskIds((ids) => [...ids, task._id])}
                    >
                      View more &#x25BC;
                    </span>
                  </>
                ) : (
                  <>
                    {task.description || "No description"}
                    {task.description && task.description.length > 120 && (
                      <span
                        style={{ cursor: "pointer", color: "#007bff", marginLeft: "5px", fontWeight: 500 }}
                        onClick={() => setExpandedTaskIds((ids) => ids.filter((id) => id !== task._id))}
                      >
                        View less &#x25B2;
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Status, created date, due date, action buttons */}
              <div
                className="d-flex flex-column flex-md-row gap-1 gap-md-4 mt-2"
                style={{ fontSize: "0.99rem" }}
              >
                <div style={{ whiteSpace: "nowrap" }}>
                  <span>
                    <b>Status:</b> {task.status}
                  </span>
                </div>

                <div style={{ whiteSpace: "nowrap" }}>
                  <b>Created On:</b> {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  <b>Due:</b> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : " -----"}
                </div>

                {/* Buttons aligned right */}
                <div className="d-flex flex-row gap-2 ms-md-auto mt-2 mt-md-0 justify-content-center justify-content-md-end w-100 w-md-auto">
                  <button className="btn btn-md btn-outline-primary" onClick={() => openEditForm(task)}>
                    Edit
                  </button>
                  <button className="btn btn-md btn-outline-danger" onClick={() => deleteTask(task._id)}>
                    Delete
                  </button>

                  {/* Dropdown to move individual task status */}
                  <Dropdown as="div">
                    <Dropdown.Toggle
                      style={{ backgroundColor: "white", color: "black", borderColor: "#3b3e40ff" }}
                      size="mm"
                      id={`dropdown-${task._id}`}
                    >
                      Move
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {MOVE_STATUSES.filter((s) => s !== task.status).map((s) => (
                        <Dropdown.Item key={s} onClick={() => moveTaskStatus(task._id, s)}>
                          Move to {s}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">How to Use Task Manager</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowHelp(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <b>Create Task:</b> Click "Create Task" to add a new task. Enter title, description, status, priority,
                  and due date.
                </p>
                <p>
                  <b>Edit Task:</b> Click "Edit" on an existing task to modify its details in the popup form.
                </p>
                <p>
                  <b>Delete Task:</b> Remove a task by clicking its "Delete" button.
                </p>
                <p>
                  <b>Filtering:</b> Use the "All", "ToDo", "InProgress", and "Completed" buttons to filter tasks by status.
                </p>
                <p>
                  <b>Search:</b> Use the search bar to quickly find tasks by title.
                </p>
                <p>This app helps you organize and track your daily tasks efficiently.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowHelp(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">{taskToEdit ? "Edit Task" : "Create Task"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeForm}></button>
              </div>
              <div className="modal-body">
                <TaskForm
                  onSave={taskToEdit ? updateTask : addTask}
                  taskToEdit={taskToEdit}
                  onCancel={closeForm}
                  isSaving={isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
