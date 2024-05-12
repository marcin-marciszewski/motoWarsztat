import { FC, useState, useEffect, useRef } from 'react';
import './App.css';
import { ITask } from './Interfaces';
import ToDoTask from './Components/ToDoTask';
import AddTask from './Components/AddTask';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { saveLocalStorage } from 'helpers';

const App: FC = () => {
  const [toDoList, setToDoList] = useState<ITask[]>([]);
  const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
  });
  const dragTask = useRef<number>(0);
  const draggedOverTask = useRef<number>(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ 'hydra:member': ITask[] }> =
        await client.get('/api/tasks');

      const data: ITask[] =
        !localStorage.getItem('toDoList') ||
        JSON.parse(localStorage.getItem('toDoList')!).length === 0
          ? response.data['hydra:member']
          : JSON.parse(localStorage.getItem('toDoList')!);

      saveLocalStorage('toDoList', JSON.stringify(data));
      setToDoList(data);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };

  function handleSort() {
    const tasksClone = [...toDoList];
    const temp = tasksClone[dragTask.current];
    tasksClone[dragTask.current] = tasksClone[draggedOverTask.current];
    tasksClone[draggedOverTask.current] = temp;
    saveLocalStorage('toDoList', JSON.stringify(tasksClone));
    setToDoList(tasksClone);
  }

  return (
    <div className="App">
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: 15 }}>
                <div className="card-body p-5">
                  <h6 className="mb-3">Todo List</h6>
                  <AddTask
                    client={client}
                    toDoList={toDoList}
                    setToDoList={setToDoList}
                  />
                  <div id="list-group mb-0">
                    {toDoList.map((task: ITask, index: number) => {
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={() => (dragTask.current = index)}
                          onDragEnter={() => (draggedOverTask.current = index)}
                          onDragEnd={handleSort}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <ToDoTask
                            index={index}
                            task={task}
                            client={client}
                            toDoList={toDoList}
                            setToDoList={setToDoList}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
