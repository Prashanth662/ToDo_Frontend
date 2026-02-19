import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSave, taskToEdit, onCancel, isSaving }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'To Do');
      setPriority(taskToEdit.priority || 'Medium');
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('Medium');
      setDueDate('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || isSaving) return;
    onSave({ title, description, status, priority, dueDate });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="taskTitle" className="form-label">Enter Task Title</label>
        <input
          id="taskTitle"
          type="text"
          className="form-control"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          autoFocus
          disabled={isSaving}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="taskDescription" className="form-label">Enter Description</label>
        <textarea
          id="taskDescription"
          className="form-control"
          placeholder="Task description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows="3"
          disabled={isSaving}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="taskStatus" className="form-label">Select Status</label>
        <select
          id="taskStatus"
          className="form-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
          disabled={isSaving}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="taskPriority" className="form-label">Select Priority</label>
        <select
          id="taskPriority"
          className="form-select"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          disabled={isSaving}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="taskDueDate" className="form-label">Due Date</label>
        <input
          id="taskDueDate"
          type="date"
          className="form-control"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-success" disabled={isSaving}>
          {isSaving ? (taskToEdit ? 'Updating...' : 'Saving...') : 'Save'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
