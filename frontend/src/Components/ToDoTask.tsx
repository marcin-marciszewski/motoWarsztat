import { ChangeEvent, useState } from 'react';
import { ITask } from '../Interfaces';
import { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { isMoreThan150Chars, saveLocalStorage } from 'helpers';

interface Props {
  index: number;
  task: ITask;
  client: AxiosInstance;
  toDoList: ITask[];
  setToDoList(toDoList: ITask[]): void;
}
const ToDoTask = ({ index, task, client, toDoList, setToDoList }: Props) => {
  const [editingName, setEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(task.name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (isMoreThan150Chars(event.target.value)) {
      alert('Please enter a task name with less than 150 characters');
      return;
    }
    setNewName(event.target.value);
  };

  const saveNewName = async (): Promise<void> => {
    if (newName === '') {
      alert('Please enter a task name');
      return;
    }

    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/merge-patch+json',
          accept: 'application/ld+json',
        },
      };

      let response: AxiosResponse<ITask> = await client.patch(
        `/api/tasks/${task.id}`,
        {
          name: newName,
        },
        axiosConfig
      );

      const data: ITask[] = toDoList.map((taskItem) =>
        taskItem.id === task.id ? response.data : taskItem
      );

      saveLocalStorage('toDoList', JSON.stringify(data));
      setToDoList(data);
      setEditingName(false);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };

  const deleteTask = async (deletedTask: ITask): Promise<void> => {
    try {
      await client.delete(`/api/tasks/${deletedTask.id}`);

      const data: ITask[] = toDoList.filter((task) => {
        return task.id !== deletedTask.id;
      });

      saveLocalStorage('toDoList', JSON.stringify(data));
      setToDoList(data);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };

  return (
    <div
      className={`list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 py-2  task-${task.id}`}
    >
      <div
        id="myCheck"
        className="close me-4"
        aria-label="Close"
        data-testid="closeBtn"
        onClick={() => {
          deleteTask(task);
        }}
      >
        <span aria-hidden="true">&times;</span>
        <span className="ms-3">{index + 1}</span>
      </div>

      {editingName ? (
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <input
              type="text"
              className="form-control"
              value={newName}
              onChange={handleChange}
            />
          </div>
          <button
            className="btn btn-primary ms-2"
            data-testid="saveEditBtn"
            onClick={() => saveNewName()}
          >
            Save changes
          </button>
          <button
            className="btn btn-danger ms-2"
            data-testid="cancelEditBtn"
            onClick={() => setEditingName(false)}
          >
            Cancel editing
          </button>
        </div>
      ) : (
        <>
          <p> {task.name}</p>
          <button
            className="btn btn-primary"
            data-testid="editBtn"
            onClick={() => setEditingName(true)}
          >
            Edit task
          </button>
        </>
      )}
    </div>
  );
};

export default ToDoTask;
