import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setTodoList, addTodo, sortTodo, updateTodo, toggleCompleted, deleteTodo} from '../TodoSlice.jsx';
import {TiEdit, TiTrash} from 'react-icons/ti';
import Myvideo from '../assets/todoVideo.mp4';

const TodoList = () => {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentToDo, setCurrentToDo] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (todoList.length > 0) { localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
  if (localTodoList) {
      dispatch(setTodoList(localTodoList));
    }
  }, []);

  const handleAddTodo = (task) => {
    if (task.trim().length === 0) {
      alert("Pls enter a task!!!");
    } else {
      dispatch(
        addTodo({ task: task, id: Date.now(), completed: false, })
      );
      setNewTask("");
      // setShowModal(true);
    } 
  };
  const handleUpdateTodoList = (id, task) => {
    if (task.trim().length === 0) {
      alert("Pls enter a task");
    } else {
      dispatch(updateTodo({ task: task, id: id }));
      setShowModal(false);
    } 
  };
  const handleDeleteTodo = (id) => {
    const updateTodoList = todoList.filter((todo) => todo.id != id);
    dispatch(setTodoList(updateTodoList));
    localStorage.setItem("todoList", JSON.stringify(updateTodoList));
  };


  function handleSort(sortCriteria){
    dispatch(sortTodo(sortCriteria));
  }
  const sortTodoList = todoList.filter((todo) => {
    if (sortCriteria === "ALL") return true;
    if (sortCriteria === "Completed" && todo.completed) return true;
    if (sortCriteria === "Incomplete" && !todo.completed) return true;
    return false;
  });
  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };

  return (
    <div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <input type ="text" className = "border p-2 rounded-md outline-none mb-8 w-full" value = {newTask} onChange={(e) => setNewTask(e.target.value)} placeholder={currentToDo ? "Update here" : "Enter here"} 
            onKeyDown={(e) => {
    if (e.key === "Enter") {
      if (currentToDo) {
        handleUpdateTodoList(currentToDo.id, newTask);
        setCurrentToDo(null);
      } else {
        handleAddTodo(newTask);
      }
      setShowModal(false);
    }
  }}
            />

            <div className="flex gap-4 justify-between">
            {currentToDo ? (
              <>
              <button className="flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-center text-white py-3 px-10 rounded-md" onClick={() => {setShowModal(false); handleUpdateTodoList(currentToDo.id,newTask)}}>Save</button>
              <button className="flex-1 bg-orange-50 text-orange-700 text-center py-3 px-10 rounded-md hover:bg-orange-100 transition" onClick={() => {setShowModal(false); setCurrentToDo(null); setNewTask("")}}>Cancel</button>
              </>
            ):(
              <>
              <button className="flex-1 bg-orange-50 text-orange-700 text-center py-3 px-10 rounded-md hover:bg-orange-100 transition" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-center text-white py-3 px-10 rounded-md" onClick={() => {setShowModal(false); handleAddTodo(newTask)}}>Add</button>
              </>
            )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center flex-col"> 
        {todoList.length === 0 ? (
            <div className="mb-8">
              <div className="sm:w-[420px] sm:h-[420px] min-w-[260px] min-h-[260px] rounded-3xl overflow-hidden shadow-2xl animate-fadeInScale transition-transform duration-300 hover:scale-[1.02]">
                <video src={Myvideo} autoPlay loop muted className="w-full h-full object-cover pointer-events-none"/>
              </div>
              <p className="text-center text-gray-500">Not have task yet?</p>
            </div>
          ) : (
            <div className="container mx-auto mt-6">
              <div className="flex justify-center mb-6"> 
                <select onChange={(e) => handleSort(e.target.value)} className=" p-2 rounded-md border border-orange-300
    text-orange-700 bg-white
    focus:ring-2 focus:ring-orange-400
    focus:outline-none">
                  <option value="ALL" className="text-sm">ALL</option>
                  <option value="Completed"className="text-sm">Completed</option>
                  <option value="Incomplete"className="text-sm">Incomplete</option>

                </select>
              </div>
              <div>
              {sortTodoList.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between mb-6 mx-auto
  w-full md:w-[75%] rounded-xl p-4
  bg-orange-100 text-orange-900 hover:bg-orange-200 transition">
                  <div className={`${todo.completed ? "line-through text-green-500" : "text-gray-800"}`} onClick={() => {handleToggleCompleted(todo.id);}}> {todo.task}</div>
                <div>
                  <button className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-lg ml-2" onClick={() => {setShowModal(true); setCurrentToDo(todo); setNewTask(todo.task);}}><TiEdit /></button>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg ml-2" onClick={() => handleDeleteTodo(todo.id)}><TiTrash /></button>
                </div>
                </div>
              ))}
              </div>
          </div>
          )} 
      {!showModal && (
  <button
    className="bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500
    text-white py-3 px-12 rounded-md
    hover:scale-105 transition-transform shadow-lg"
    onClick={() => setShowModal(true)}
  >
    Add Task
  </button>
)}
      </div>
    </div>
  );
};

export default TodoList;
