import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.tsx';

describe('Todo App', () => {

  // Тест 1: Проверяем, что компонент рендерится без ошибок
  it('renders the main heading and input field', () => {
    render(<App />);
    expect(screen.getByText('todos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
  });

  // Тест 2: Проверяем добавление новой задачи
  it('allows users to add a new task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByText('Add');

    await user.type(input, 'Learn testing');
    await user.click(addButton);

    expect(screen.getByText('Learn testing')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  // Тест 3: Проверяем завершение задачи
  it('allows users to complete a task', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'Write a test');
    await user.click(screen.getByText('Add'));

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const listItem = screen.getByText('Write a test').closest('li');
    expect(listItem).toHaveClass('completed');
  });

  // Тест 4: Проверяем фильтрацию задач
  it('filters tasks between all, active, and completed', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'Active Task');
    await user.click(screen.getByText('Add'));
    await user.type(input, 'Completed Task');
    await user.click(screen.getByText('Add'));

    const completedCheckbox = screen.getByText('Completed Task').previousElementSibling as HTMLInputElement;
    await user.click(completedCheckbox);

    await user.click(screen.getByText('Completed'));
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();

    await user.click(screen.getByText('Active'));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();

    await user.click(screen.getByText('All'));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });
  
  // Тест 5: Проверяем очистку выполненных задач
  it('clears completed tasks', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'Task to be cleared');
    await user.click(screen.getByText('Add'));
    await user.click(screen.getByRole('checkbox'));

    const clearButton = screen.getByText('Clear completed');
    await user.click(clearButton);

    expect(screen.queryByText('Task to be cleared')).not.toBeInTheDocument();
  });
});