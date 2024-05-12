import { ChangeEvent, useState } from 'react';
import { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { ITask } from '../Interfaces';
import { isMoreThan150Chars, saveLocalStorage } from 'helpers';

interface Props {
  client: AxiosInstance;
  toDoList: ITask[];
  setToDoList(toDoList: ITask[]): void;
}

const AddTask = ({ client, toDoList, setToDoList }: Props) => {
  const [content, setContent] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (isMoreThan150Chars(event.target.value)) {
      alert('Please enter a task name with less than 150 characters');
      return;
    }
    setContent(event.target.value);
  };

  const addTask = async (): Promise<void> => {
    if (content === '') {
      alert('Please enter a task');
      return;
    }

    if (toDoList.length >= 10) {
      alert('You can only have 10 tasks');
      return;
    }

    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/ld+json',
          accept: 'application/ld+json',
        },
      };

      let response: AxiosResponse<ITask> = await client.post(
        '/api/tasks',
        {
          name: content,
        },
        axiosConfig
      );
      const data: ITask[] = [response.data, ...toDoList];

      setToDoList(data);
      saveLocalStorage('toDoList', JSON.stringify(data));
      setContent('');
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-start mb-4">
      <div className="form-outline flex-fill">
        <input
          placeholder="Add task...."
          name="task"
          value={content}
          onChange={handleChange}
          type="text"
          id="form3"
          className="form-control form-control-lg"
          required
        />
        <label className="form-label" htmlFor="form3">
          What do you need to do today?
        </label>
      </div>
      <button onClick={addTask} className="btn btn-primary btn-lg ms-2">
        Save Task
      </button>
    </div>
  );
};

export default AddTask;
