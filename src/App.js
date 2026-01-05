import { useState, useEffect } from 'react';
import './App.css';

const GOALS = [
  { id: 'weight-loss', name: 'Weight Loss', icon: '🔥', description: 'Burn fat and get lean' },
  { id: 'muscle-gain', name: 'Muscle Gain', icon: '💪', description: 'Build strength and mass' },
  { id: 'fitness', name: 'General Fitness', icon: '🏃', description: 'Stay healthy and active' },
  { id: 'endurance', name: 'Endurance', icon: '⚡', description: 'Improve stamina' },
];

const LIFESTYLES = [
  { id: 'sedentary', name: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
  { id: 'light', name: 'Lightly Active', description: 'Exercise 1-3 days/week', multiplier: 1.375 },
  { id: 'moderate', name: 'Moderately Active', description: 'Exercise 3-5 days/week', multiplier: 1.55 },
  { id: 'active', name: 'Very Active', description: 'Exercise 6-7 days/week', multiplier: 1.725 },
];

const HABITS = [
  { id: 'water', name: 'Drink 8 glasses of water daily', icon: '💧' },
  { id: 'sleep', name: 'Get 7-8 hours of sleep', icon: '😴' },
  { id: 'breakfast', name: 'Never skip breakfast', icon: '🍳' },
  { id: 'steps', name: 'Walk 10,000 steps daily', icon: '👟' },
  { id: 'protein', name: 'Eat protein with every meal', icon: '🥩' },
  { id: 'veggies', name: 'Eat 5 servings of vegetables', icon: '🥗' },
];

function App() {
  const [onboardingStep, setOnboardingStep] = useState(() => {
    const saved = localStorage.getItem('onboardingComplete');
    return saved ? 5 : 1;
  });
  
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : {
      name: '',
      age: '',
      weight: '',
      height: '',
      goal: '',
      lifestyle: '',
      selectedHabits: []
    };
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (onboardingStep === 5) {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [onboardingStep, userData]);

  const calculateBMI = () => {
    if (!userData.weight || !userData.height) return 0;
    const heightInMeters = userData.height / 100;
    return (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateCalories = () => {
    if (!userData.weight || !userData.height || !userData.age || !userData.lifestyle) return 0;
    // BMR calculation (Mifflin-St Jeor Equation for men, simplified)
    const bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
    const lifestyle = LIFESTYLES.find(l => l.id === userData.lifestyle);
    return Math.round(bmr * (lifestyle?.multiplier || 1.2));
  };

  const getPersonalizedPlan = () => {
    const goal = GOALS.find(g => g.id === userData.goal);
    const bmi = calculateBMI();
    const calories = calculateCalories();

    let workoutPlan = [];
    let dietPlan = [];
    let tips = [];

    if (userData.goal === 'weight-loss') {
      workoutPlan = [
        '🏃 Cardio: 30-45 min, 5 days/week',
        '🏋️ Strength Training: 3 days/week',
        '🚶 Daily walks: 10,000 steps',
        '🧘 Yoga/Stretching: 2 days/week'
      ];
      dietPlan = [
        `🍽️ Target: ${calories - 500} calories/day (deficit)`,
        '🥗 High protein, low carb meals',
        '💧 Drink 3-4 liters of water',
        '🚫 Avoid processed foods'
      ];
      tips = [
        'Track your calories daily',
        'Meal prep on Sundays',
        'Sleep 7-8 hours for recovery',
        'Stay consistent for 12 weeks'
      ];
    } else if (userData.goal === 'muscle-gain') {
      workoutPlan = [
        '🏋️ Weight Training: 5 days/week',
        '💪 Focus on compound movements',
        '🏃 Light cardio: 2 days/week',
        '😴 Rest days: 2 days/week'
      ];
      dietPlan = [
        `🍽️ Target: ${calories + 500} calories/day (surplus)`,
        '🥩 1.6-2.2g protein per kg bodyweight',
        '🍚 Complex carbs for energy',
        '🥑 Healthy fats for hormones'
      ];
      tips = [
        'Progressive overload is key',
        'Eat protein within 2hrs post-workout',
        'Track your lifts',
        'Be patient - gains take time'
      ];
    } else if (userData.goal === 'fitness') {
      workoutPlan = [
        '🏃 Cardio: 3 days/week',
        '🏋️ Strength: 2 days/week',
        '🧘 Flexibility: 2 days/week',
        '🚶 Active lifestyle daily'
      ];
      dietPlan = [
        `🍽️ Target: ${calories} calories/day (maintenance)`,
        '🥗 Balanced macros',
        '🍎 Whole foods focus',
        '💧 Stay hydrated'
      ];
      tips = [
        'Find activities you enjoy',
        'Make fitness a lifestyle',
        'Mix up your routine',
        'Listen to your body'
      ];
    } else {
      workoutPlan = [
        '🏃 Running: 4 days/week',
        '🚴 Cycling: 2 days/week',
        '🏊 Swimming: 1 day/week',
        '💪 Core work: 3 days/week'
      ];
      dietPlan = [
        `🍽️ Target: ${calories + 200} calories/day`,
        '🍚 High carb for energy',
        '🥩 Moderate protein',
        '💧 Electrolytes important'
      ];
      tips = [
        'Build mileage gradually',
        'Recovery is crucial',
        'Cross-train to prevent injury',
        'Fuel before long sessions'
      ];
    }

    return { workoutPlan, dietPlan, tips, calories, bmi };
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('userData');
    setOnboardingStep(1);
    setUserData({
      name: '',
      age: '',
      weight: '',
      height: '',
      goal: '',
      lifestyle: '',
      selectedHabits: []
    });
  };

  return (
    <div className="App">
      {onboardingStep === 5 && (
        <nav className="nav">
          <div className="nav-left">
            <div className="logo">FitnessTracker</div>
            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
              <button onClick={() => setMenuOpen(false)}>Dashboard</button>
              <button onClick={() => { resetOnboarding(); setMenuOpen(false); }}>Reset Profile</button>
            </div>
          </div>
          <div className="user-greeting">Hi, {userData.name}! 👋</div>
        </nav>
      )}

      <div className="container">
        {/* Step 1: Name */}
        {onboardingStep === 1 && (
          <div className="onboarding-screen">
            <div className="onboarding-card">
              <div className="step-indicator">Step 1 of 4</div>
              <h1 className="onboarding-title">Welcome to FitnessTracker! 💪</h1>
              <p className="onboarding-subtitle">Let's personalize your fitness journey</p>
              
              <div className="input-group">
                <label>What's your name?</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  autoFocus
                />
              </div>

              <button
                className="next-btn"
                onClick={() => setOnboardingStep(2)}
                disabled={!userData.name}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {onboardingStep === 2 && (
          <div className="onboarding-screen">
            <div className="onboarding-card">
              <div className="step-indicator">Step 2 of 4</div>
              <h1 className="onboarding-title">What's your goal, {userData.name}?</h1>
              <p className="onboarding-subtitle">Choose your primary fitness objective</p>
              
              <div className="goals-grid">
                {GOALS.map(goal => (
                  <div
                    key={goal.id}
                    className={`goal-option ${userData.goal === goal.id ? 'selected' : ''}`}
                    onClick={() => setUserData({ ...userData, goal: goal.id })}
                  >
                    <div className="goal-icon">{goal.icon}</div>
                    <h3>{goal.name}</h3>
                    <p>{goal.description}</p>
                  </div>
                ))}
              </div>

              <div className="button-group">
                <button className="back-btn" onClick={() => setOnboardingStep(1)}>← Back</button>
                <button
                  className="next-btn"
                  onClick={() => setOnboardingStep(3)}
                  disabled={!userData.goal}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Personalization */}
        {onboardingStep === 3 && (
          <div className="onboarding-screen">
            <div className="onboarding-card">
              <div className="step-indicator">Step 3 of 4</div>
              <h1 className="onboarding-title">Tell us about yourself</h1>
              <p className="onboarding-subtitle">This helps us create your personalized plan</p>
              
              <div className="form-grid">
                <div className="input-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={userData.age}
                    onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="70"
                    value={userData.weight}
                    onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    placeholder="175"
                    value={userData.height}
                    onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Current Lifestyle</label>
                  <select
                    value={userData.lifestyle}
                    onChange={(e) => setUserData({ ...userData, lifestyle: e.target.value })}
                  >
                    <option value="">Select your activity level</option>
                    {LIFESTYLES.map(lifestyle => (
                      <option key={lifestyle.id} value={lifestyle.id}>
                        {lifestyle.name} - {lifestyle.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group full-width">
                  <label>Healthy Habits (Select all that apply)</label>
                  <div className="habits-grid">
                    {HABITS.map(habit => (
                      <div
                        key={habit.id}
                        className={`habit-option ${userData.selectedHabits.includes(habit.id) ? 'selected' : ''}`}
                        onClick={() => {
                          const habits = userData.selectedHabits.includes(habit.id)
                            ? userData.selectedHabits.filter(h => h !== habit.id)
                            : [...userData.selectedHabits, habit.id];
                          setUserData({ ...userData, selectedHabits: habits });
                        }}
                      >
                        <span className="habit-icon">{habit.icon}</span>
                        <span className="habit-name">{habit.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button className="back-btn" onClick={() => setOnboardingStep(2)}>← Back</button>
                <button
                  className="next-btn"
                  onClick={() => setOnboardingStep(4)}
                  disabled={!userData.age || !userData.weight || !userData.height || !userData.lifestyle}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Your Personalized Guide */}
        {onboardingStep === 4 && (
          <div className="onboarding-screen">
            <div className="onboarding-card wide">
              <div className="step-indicator">Step 4 of 4</div>
              <h1 className="onboarding-title">Your Personalized Fitness Guide 🎯</h1>
              <p className="onboarding-subtitle">Based on your profile, here's your custom plan</p>
              
              {(() => {
                const plan = getPersonalizedPlan();
                return (
                  <div className="guide-content">
                    <div className="stats-summary">
                      <div className="stat-box">
                        <div className="stat-label">BMI</div>
                        <div className="stat-value">{plan.bmi}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Daily Calories</div>
                        <div className="stat-value">{plan.calories}</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Goal</div>
                        <div className="stat-value">{GOALS.find(g => g.id === userData.goal)?.icon}</div>
                      </div>
                    </div>

                    <div className="plan-sections">
                      <div className="plan-section">
                        <h3>🏋️ Workout Plan</h3>
                        <ul>
                          {plan.workoutPlan.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="plan-section">
                        <h3>🍽️ Diet Plan</h3>
                        <ul>
                          {plan.dietPlan.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="plan-section">
                        <h3>💡 Pro Tips</h3>
                        <ul>
                          {plan.tips.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {userData.selectedHabits.length > 0 && (
                        <div className="plan-section">
                          <h3>✅ Your Healthy Habits</h3>
                          <div className="selected-habits">
                            {userData.selectedHabits.map(habitId => {
                              const habit = HABITS.find(h => h.id === habitId);
                              return (
                                <div key={habitId} className="habit-badge">
                                  {habit?.icon} {habit?.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="button-group">
                <button className="back-btn" onClick={() => setOnboardingStep(3)}>← Back</button>
                <button className="next-btn" onClick={() => setOnboardingStep(5)}>
                  Start Your Journey! 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {onboardingStep === 5 && (
          <div className="dashboard">
            <div className="welcome-banner">
              <h1>Welcome back, {userData.name}! 💪</h1>
              <p>Your goal: {GOALS.find(g => g.id === userData.goal)?.name}</p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>📊 Your Stats</h3>
                <div className="stat-list">
                  <div className="stat-item">
                    <span>BMI:</span>
                    <strong>{calculateBMI()}</strong>
                  </div>
                  <div className="stat-item">
                    <span>Weight:</span>
                    <strong>{userData.weight} kg</strong>
                  </div>
                  <div className="stat-item">
                    <span>Height:</span>
                    <strong>{userData.height} cm</strong>
                  </div>
                  <div className="stat-item">
                    <span>Daily Calories:</span>
                    <strong>{calculateCalories()} cal</strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>🎯 Today's Plan</h3>
                {getPersonalizedPlan().workoutPlan.slice(0, 3).map((item, i) => (
                  <div key={i} className="plan-item">{item}</div>
                ))}
              </div>

              <div className="dashboard-card">
                <h3>🍽️ Nutrition</h3>
                {getPersonalizedPlan().dietPlan.slice(0, 3).map((item, i) => (
                  <div key={i} className="plan-item">{item}</div>
                ))}
              </div>

              <div className="dashboard-card">
                <h3>✅ Your Habits</h3>
                <div className="habits-list">
                  {userData.selectedHabits.map(habitId => {
                    const habit = HABITS.find(h => h.id === habitId);
                    return (
                      <div key={habitId} className="habit-item">
                        {habit?.icon} {habit?.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button className="reset-profile-btn" onClick={resetOnboarding}>
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
