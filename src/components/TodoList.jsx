import React, { useState, useEffect, useMemo, use } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setTodoList, addTodo, sortTodo, updateTodo, toggleCompleted, deleteTodo } from '../TodoSlice.jsx';
import { TiEdit, TiTrash } from 'react-icons/ti';
import Myvideo from '../assets/Videoo.mp4';

const TodoList = () => {
  //cc gửi yêu cầu tới store để lấy dữ liệu và gửi hành động (dispatch actions)
  const dispatch = useDispatch();
  //selector để lấy dữ liệu từ store
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentToDo, setCurrentToDo] = useState(null);
  const [newTask, setNewTask] = useState("");

useEffect(() => {
  // Luôn lưu mỗi khi có thay đổi
  localStorage.setItem("todoList", JSON.stringify(todoList));
}, [todoList]);

useEffect(() => {
  const syncTabs = (e) => {
    if (e.key === "todoList" && e.newValue) {
      dispatch(setTodoList(JSON.parse(e.newValue)));
    }
  };
  window.addEventListener("storage", syncTabs);
  return () => window.removeEventListener("storage", syncTabs);
}, [dispatch]);

  const handleAddTodo = (task) => {
    if (task.trim().length === 0) {
      alert("Pls enter a task!!!");
    } else {
      dispatch(
        addTodo({ task: task, id: Date.now(), completed: false, })
      );
      setNewTask("");
      //setShowModal(true);
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
  // Chỉ cần gửi ID đi, để Reducer trong Slice tự xử lý việc lọc xóa
  dispatch(deleteTodo({ id })); 
};


  function handleSort(sortCriteria) {
    dispatch(sortTodo(sortCriteria));
  }
  // const sortTodoList = todoList.filter((todo) => {
  //   console.log("Current sort criteria:", sortCriteria);
    
  //   if (sortCriteria === "ALL") return true;
  //   if (sortCriteria === "Completed" && todo.completed) return true;
  //   if (sortCriteria === "Incomplete" && !todo.completed) return true;
  //   return false;
  // });
  // Sửa đoạn này trong TodoList.jsx
// Sử dụng useMemo để lọc dữ liệu dựa trên tiêu chí từ Store
const sortTodoList = useMemo(() => {
  // Hàm này chỉ chạy khi danh sách task hoặc tiêu chí lọc thay đổi
  //console.log("Trigger lọc danh sách với:", sortCriteria);

  return todoList.filter((todo) => {
    // 1. Nếu chọn ALL: Trả về tất cả
    if (sortCriteria === "ALL") return true;

    // 2. Nếu chọn Completed: Chỉ lấy những task có completed là true
    if (sortCriteria === "Completed") return todo.completed === true;

    // 3. Nếu chọn Incomplete: Chỉ lấy những task có completed là false
    if (sortCriteria === "Incomplete") return todo.completed === false;

    return true; 
  });
}, [todoList, sortCriteria]); // Mảng phụ thuộc quan trọng
  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };

  return (
    <div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <input type="text" className="border p-2 rounded-md outline-none mb-8 w-full" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder={currentToDo ? "Update here" : "Enter here"}
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
                  <button className="flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-center text-white py-3 px-10 rounded-md" onClick={() => { setShowModal(false); handleUpdateTodoList(currentToDo.id, newTask) }}>Save</button>
                  <button className="flex-1 bg-orange-50 text-orange-700 text-center py-3 px-10 rounded-md hover:bg-orange-100 transition" onClick={() => { setShowModal(false); setCurrentToDo(null); setNewTask("") }}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="flex-1 bg-orange-50 text-orange-700 text-center py-3 px-10 rounded-md hover:bg-orange-100 transition" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-center text-white py-3 px-10 rounded-md" onClick={() => { setShowModal(false); handleAddTodo(newTask) }}>Add</button>
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
              <video src={Myvideo} autoPlay loop muted className="w-full h-full object-cover pointer-events-none" />
            </div>
            <p className="text-center text-gray-500">Not have task yet?</p>
          </div>
        ) : (
          <div className="container mx-auto mt-6">
            <div className="flex justify-center mb-6">
              <select onChange={(e) => handleSort(e.target.value)} className=" p-2 rounded-md border border-orange-300  text-orange-700 bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none">
                <option value="ALL" className="text-sm">ALL</option>
                <option value="Completed" className="text-sm">Completed</option>
                <option value="Incomplete" className="text-sm">Incomplete</option>
              </select>
            </div>
            <div>
              {sortTodoList.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => handleToggleCompleted(todo.id)}
                  className="flex items-center justify-between mb-6 mx-auto w-full md:w-[75%] rounded-xl p-4 bg-orange-100 text-orange-900 hover:bg-orange-200 transition cursor-pointer">
                  <div className={`${todo.completed ? "line-through text-green-500" : "text-gray-800"}`}>
                    {todo.task}
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    {/* Quan trọng: Dùng e.stopPropagation() để khi bấm nút Sửa/Xóa nó không bị kích hoạt nhầm tính năng Hoàn thành của thẻ cha */}
                    <button className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-lg ml-2" onClick={() => { setShowModal(true); setCurrentToDo(todo); setNewTask(todo.task); }}><TiEdit /></button>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg ml-2" onClick={() => handleDeleteTodo(todo.id)}><TiTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!showModal && (
          <button className="bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-white py-3 px-12 rounded-md hover:scale-105 transition-transform shadow-lg"
            onClick={() => {
              setNewTask(""); // Reset input
              setCurrentToDo(null); // Đảm bảo không ở chế độ Update
              setShowModal(true);
            }}> Add Task</button>
        )}
      </div>
    </div>
  );
};

export default TodoList;