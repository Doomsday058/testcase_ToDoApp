import React, { useState } from 'react';
import './index.css'; 

interface Task {
  id: number; 
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [newTask, setNewTask] = useState(''); 
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTaskCompletion = (id: number) => { 
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; 
  });

  const remainingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="todo-container">
      <h1>todos</h1> 
      
      <div className="input-wrapper">
        <input
          type="text"
          className="todo-input"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'task-item completed' : 'task-item'}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <label>{task.text}</label>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <div className="footer">
          <span>{remainingTasks} tasks left</span>
          <div className="filters">
            <button 
              onClick={() => setFilter('all')} 
              className={filter === 'all' ? 'selected' : ''}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'selected' : ''}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'selected' : ''}
            >
              Completed
            </button>
          </div>
          <button onClick={clearCompleted} className="clear-completed-btn">
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
}

export default App;