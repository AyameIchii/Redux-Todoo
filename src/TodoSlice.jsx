import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    todoList: [],
    sortCriteria: "ALL", // 'all', 'completed', 'incomplete'
};

const TodoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        setTodoList: (state, action) => {
            state.todoList = action.payload;
        },
        addTodo: (state, action) => {
            state.todoList.push({
                task: action.payload.task,
                id: action.payload.id,
                completed: false,
        });
        },
        sortTodo: (state, action) => {
            state.sortCriteria = action.payload;
        },
        updateTodo: (state, action) => {
            const {id, task} = action.payload;
            const index = state.todoList.findIndex((todo) => todo.id === id);
            state.todoList[index].task = task;
        },
        toggleCompleted: (state, action) => {
            const {id} = action.payload;
            const index = state.todoList.findIndex((todo) => todo.id === id);
            state.todoList[index].completed = !state.todoList[index].completed;
        },
        deleteTodo: (state, action) => {
            const {id} = action.payload;
            state.todoList = state.todoList.filter((todo) => todo.id !== id);
        },
    },
});
export const { setTodoList, addTodo, sortTodo, updateTodo, toggleCompleted, deleteTodo } = TodoSlice.actions;
export default TodoSlice.reducer;



