import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('should add new task', async () => {
    render(<App />);
    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText(/Add task.../i);
    const saveButtonEl = screen.getByRole('button', { name: 'Save Task' });
    fireEvent.change(inputElement, { target: { value: 'Clean house' } });
    fireEvent.click(saveButtonEl);
    const taskEl = await screen.findByText(/Clean House/i);

    expect(taskEl).toBeInTheDocument();
  });

  it('should delete a task', async () => {
    render(<App />);
    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText(/Add task.../i);
    const saveButtonEl = screen.getByRole('button', { name: 'Save Task' });
    fireEvent.change(inputElement, { target: { value: 'Clean house' } });
    fireEvent.click(saveButtonEl);
    const closeButtonEl = await screen.findByTestId('closeBtn');
    fireEvent.click(closeButtonEl);
    await waitFor(() => {
      const taskEl = screen.queryByText(/Clean house/i);
      expect(taskEl).toBeNull();
    });
  });

  it('should edit task name', async () => {
    render(<App />);
    const inputElement: HTMLInputElement =
      screen.getByPlaceholderText(/Add task.../i);
    const saveButtonEl = screen.getByRole('button', { name: 'Save Task' });
    fireEvent.change(inputElement, { target: { value: 'Clean house' } });
    fireEvent.click(saveButtonEl);

    const editBtn = await screen.findByTestId('editBtn');
    fireEvent.click(editBtn);
    const inputEditElement: HTMLInputElement =
      screen.getByDisplayValue(/Clean house/i);
    fireEvent.change(inputEditElement, { target: { value: 'Edited text' } });
    const saveChangeButtonEl = await screen.findByTestId('saveEditBtn');
    fireEvent.click(saveChangeButtonEl);
    const taskEl = await screen.findByText(/Edited text/i);
    expect(taskEl).toBeInTheDocument();
  });
});
