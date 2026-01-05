import { useState, useEffect } from 'react';
import './App.css';

const EXERCISES = [
  { id: 1, name: 'Running', icon: '🏃', calories: 300 },
  { id: 2, name: 'Cycling', icon: '🚴', calories: 250 },
  { id: 3, name: 'Swimming', icon: '🏊', calories: 400 },
  { id: 4, name: 'Yoga', icon: '🧘', calories: 150 },
  { id: 5, name: 'Weight Training', icon: '🏋️', calories: 350 },
  { id: 6, name: 'Walking', icon: '🚶', calories: 200 },
];

const INITIAL_WORKOUTS = [
  { id: 1, exercise: 'Running', duration: 30, date: '2026-01-05', calories: 300 },
  { id: 2, exercise: 'Yoga', duration: 45, date: '2026-01-04', calories: 150 },
];

function App() {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : { weeklyWorkouts: 5, weeklyCalories: 2000 };
  });
  const [view, setView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    exercise: 'Running',
    duration: 30,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return workoutDate >= weekStart;
  });

  const stats = {
    totalWorkouts: workouts.length,
    weeklyWorkouts: thisWeekWorkouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
    weeklyCalories: thisWeekWorkouts.reduce((sum, w) => sum + w.calories, 0),
    avgDuration: workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length) : 0
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exercise = EXERCISES.find(ex => ex.name === formData.exercise);
    const calories = Math.round((exercise.calories / 60) * formData.duration);
    setWorkouts([...workouts, { ...formData, id: Date.now(), calories }]);
    setShowModal(false);
    setFormData({ exercise: 'Running', duration: 30, date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this workout?')) {
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <div className="logo" onClick={() => setView('dashboard')}>FitnessTracker</div>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => { setView('dashboard'); setMenuOpen(false); }}>Dashboard</button>
            <button onClick={() => { setView('exercises'); setMenuOpen(false); }}>Exercises</button>
            <button onClick={() => { setView('history'); setMenuOpen(false); }}>History</button>
            <button onClick={() => { setView('goals'); setMenuOpen(false); }}>Goals</button>
          </div>
        </div>
        <button className="add-workout-btn" onClick={() => setShowModal(true)}>
          + Log Workout
        </button>
      </nav>

      {/* Main Content */}
      <div className="container">
        {view === 'dashboard' && (
          <div className="dashboard-view">
            <h2>Dashboard</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💪</div>
                <div className="stat-value">{stats.totalWorkouts}</div>
                <div className="stat-label">Total Workouts</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{stats.weeklyWorkouts}</div>
                <div className="stat-label">This Week</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{stats.weeklyCalories}</div>
                <div className="stat-label">Calories Burned</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{stats.avgDuration}min</div>
                <div className="stat-label">Avg Duration</div>
              </div>
            </div>

            <div className="progress-section">
              <h3>Weekly Goals</h3>
              <div className="goal-progress">
                <div className="goal-item">
                  <div className="goal-header">
                    <span>Workouts: {stats.weeklyWorkouts} / {goals.weeklyWorkouts}</span>
                    <span>{Math.round((stats.weeklyWorkouts / goals.weeklyWorkouts) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min((stats.weeklyWorkouts / goals.weeklyWorkouts) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="goal-item">
                  <div className="goal-header">
                    <span>Calories: {stats.weeklyCalories} / {goals.weeklyCalories}</span>
                    <span>{Math.round((stats.weeklyCalories / goals.weeklyCalories) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min((stats.weeklyCalories / goals.weeklyCalories) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-workouts">
              <h3>Recent Workouts</h3>
              <div className="workout-list">
                {workouts.slice(-5).reverse().map(workout => (
                  <div key={workout.id} className="workout-card">
                    <div className="workout-icon">
                      {EXERCISES.find(ex => ex.name === workout.exercise)?.icon}
                    </div>
                    <div className="workout-info">
                      <h4>{workout.exercise}</h4>
                      <p>{workout.duration} minutes • {workout.calories} cal</p>
                    </div>
                    <div className="workout-date">{workout.date}</div>
                    <button className="delete-btn" onClick={() => handleDelete(workout.id)}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'exercises' && (
          <div className="exercises-view">
            <h2>Exercise Library</h2>
            <div className="exercise-grid">
              {EXERCISES.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-icon">{exercise.icon}</div>
                  <h3>{exercise.name}</h3>
                  <p className="calories-info">~{exercise.calories} cal/hour</p>
                  <button
                    className="quick-log-btn"
                    onClick={() => {
                      setFormData({ ...formData, exercise: exercise.name });
                      setShowModal(true);
                    }}
                  >
                    Quick Log
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="history-view">
            <h2>Workout History</h2>
            <div className="history-table">
              {workouts.slice().reverse().map(workout => (
                <div key={workout.id} className="history-row">
                  <div className="history-cell">
                    <span className="exercise-icon">
                      {EXERCISES.find(ex => ex.name === workout.exercise)?.icon}
                    </span>
                    <span>{workout.exercise}</span>
                  </div>
                  <div className="history-cell">{workout.duration} min</div>
                  <div className="history-cell">{workout.calories} cal</div>
                  <div className="history-cell">{workout.date}</div>
                  <div className="history-cell">
                    <button onClick={() => handleDelete(workout.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'goals' && (
          <div className="goals-view">
            <h2>Set Your Goals</h2>
            <div className="goals-form">
              <div className="goal-input">
                <label>Weekly Workouts Target</label>
                <input
                  type="number"
                  value={goals.weeklyWorkouts}
                  onChange={(e) => setGoals({ ...goals, weeklyWorkouts: parseInt(e.target.value) })}
                  min="1"
                  max="14"
                />
              </div>
              <div className="goal-input">
                <label>Weekly Calories Target</label>
                <input
                  type="number"
                  value={goals.weeklyCalories}
                  onChange={(e) => setGoals({ ...goals, weeklyCalories: parseInt(e.target.value) })}
                  min="500"
                  step="100"
                />
              </div>
            </div>

            <div className="goal-suggestions">
              <h3>Suggested Goals</h3>
              <div className="suggestion-cards">
                <div className="suggestion-card" onClick={() => setGoals({ weeklyWorkouts: 3, weeklyCalories: 1500 })}>
                  <h4>Beginner</h4>
                  <p>3 workouts/week</p>
                  <p>1500 calories/week</p>
                </div>
                <div className="suggestion-card" onClick={() => setGoals({ weeklyWorkouts: 5, weeklyCalories: 2500 })}>
                  <h4>Intermediate</h4>
                  <p>5 workouts/week</p>
                  <p>2500 calories/week</p>
                </div>
                <div className="suggestion-card" onClick={() => setGoals({ weeklyWorkouts: 7, weeklyCalories: 3500 })}>
                  <h4>Advanced</h4>
                  <p>7 workouts/week</p>
                  <p>3500 calories/week</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Workout</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Exercise *</label>
                  <select
                    value={formData.exercise}
                    onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                    required
                  >
                    {EXERCISES.map(ex => (
                      <option key={ex.id} value={ex.name}>{ex.icon} {ex.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Log Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
