import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('brutal-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [counter, setCounter] = useState(() => {
    const saved = localStorage.getItem('brutal-counter');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('brutal-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('brutal-counter', counter.toString());
  }, [counter]);

  const addTodo = () => {
    if (input.trim() === '') return;
    const newTodo: Todo = {
      id: counter,
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setCounter(counter + 1);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-white text-black font-mono flex flex-col">
      {/* Brutal grid lines background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <header className="border-b-4 border-black p-4 md:p-6 lg:p-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter uppercase">
                TASKS_
              </h1>
              <p className="text-xs md:text-sm tracking-widest mt-1 opacity-60">
                // BRUTALIST TODO SYSTEM v1.0
              </p>
            </div>
            <div className="text-xs md:text-sm text-right">
              <div className="border-2 border-black px-3 py-2 inline-block">
                <span className="opacity-60">ACTIVE:</span> {String(activeTodos).padStart(3, '0')} |
                <span className="opacity-60 ml-2">DONE:</span> {String(completedTodos).padStart(3, '0')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 relative">
        <div className="max-w-4xl mx-auto">

          {/* Input section */}
          <div className="border-4 border-black mb-6 md:mb-8">
            <div className="border-b-2 border-black bg-black text-white px-3 py-2 text-xs tracking-widest">
              NEW_TASK
            </div>
            <div className="flex flex-col md:flex-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="ENTER TASK DESCRIPTION..."
                className="flex-1 p-4 md:p-5 text-sm md:text-lg bg-transparent outline-none placeholder:text-black/30 uppercase tracking-wide border-b-2 md:border-b-0 md:border-r-2 border-black"
              />
              <button
                onClick={addTodo}
                className="bg-black text-white px-6 md:px-8 py-4 md:py-5 text-sm md:text-lg font-bold uppercase tracking-widest hover:bg-[#FF0000] active:bg-[#FF0000] min-h-[56px]"
              >
                ADD [{String(counter).padStart(3, '0')}]
              </button>
            </div>
          </div>

          {/* Todo list */}
          <div className="space-y-0">
            {todos.length === 0 ? (
              <div className="border-4 border-dashed border-black/20 p-8 md:p-12 text-center">
                <p className="text-lg md:text-xl opacity-30 uppercase tracking-widest">
                  // NO TASKS REGISTERED
                </p>
                <p className="text-xs mt-2 opacity-20">
                  SYSTEM IDLE...
                </p>
              </div>
            ) : (
              todos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={`border-4 border-black border-b-2 last:border-b-4 flex items-stretch ${
                    todo.completed ? 'bg-black/5' : 'bg-white'
                  }`}
                >
                  {/* Index marker */}
                  <div className="border-r-2 border-black px-2 md:px-3 py-3 md:py-4 flex items-center justify-center bg-black text-white min-w-[50px] md:min-w-[60px]">
                    <span className="text-xs md:text-sm font-bold">
                      #{String(todo.id).padStart(3, '0')}
                    </span>
                  </div>

                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="border-r-2 border-black px-3 md:px-4 py-3 md:py-4 flex items-center justify-center hover:bg-black/10 min-w-[56px] md:min-w-[60px]"
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 border-3 border-black flex items-center justify-center ${
                      todo.completed ? 'bg-black' : 'bg-white'
                    }`}>
                      {todo.completed && (
                        <span className="text-white font-bold text-sm md:text-base">X</span>
                      )}
                    </div>
                  </button>

                  {/* Task text */}
                  <div
                    className="flex-1 px-3 md:px-4 py-3 md:py-4 flex items-center cursor-pointer hover:bg-black/5 min-h-[56px]"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <span className={`text-sm md:text-base lg:text-lg uppercase tracking-wide break-words ${
                      todo.completed
                        ? 'line-through decoration-4 decoration-[#FF0000] opacity-40'
                        : ''
                    }`}>
                      {todo.text}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="border-l-2 border-black px-3 md:px-4 py-3 md:py-4 flex items-center justify-center hover:bg-[#FF0000] hover:text-white min-w-[56px] md:min-w-[60px]"
                    aria-label="Delete task"
                  >
                    <span className="font-bold text-lg md:text-xl">DEL</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Actions bar */}
          {completedTodos > 0 && (
            <div className="mt-6 md:mt-8 border-4 border-black flex flex-col md:flex-row items-stretch md:items-center justify-between p-0">
              <div className="px-4 py-3 border-b-2 md:border-b-0 md:border-r-2 border-black text-xs tracking-widest opacity-60">
                {completedTodos} TASK{completedTodos !== 1 ? 'S' : ''} COMPLETED
              </div>
              <button
                onClick={clearCompleted}
                className="px-4 md:px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white min-h-[48px]"
              >
                PURGE COMPLETED
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black p-4 md:p-6 relative">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs tracking-widest opacity-40">
          <div>
            SYS_TIME: {new Date().toISOString().split('T')[0]}
          </div>
          <div>
            Requested by @web-user · Built by @clonkbot
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
