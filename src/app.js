class CalorieTracker {
  constructor() {
    this._caloriesLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    // putting the methods in constructor, 
    // we run run them immediately, 
    // so we can see default value in html, 
    // but then need to render updated values if have been 
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  // Public methods/ API //
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }

  // Private methods //
  _displayCaloriesTotal() {
    const caloriesTotalEl = document.getElementById('calories-total');
    caloriesTotalEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById('calories-limit');
    caloriesLimitEl.innerHTML = this._caloriesLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById('calories-consumed');
    const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');
    const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
    caloriesBurnedEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const progressBarEl = document.querySelector('.progress-bar');
    const remaining = this._caloriesLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;

    // Change element bcg color for success/danger if calories limit is exceeded or not
    if (remaining < 0) {
      caloriesRemainingEl.parentElement.classList.remove('success');
      caloriesRemainingEl.parentElement.classList.add('danger');
      progressBarEl.classList.remove('success');
      progressBarEl.classList.add('danger');
    } else {
      caloriesRemainingEl.parentElement.classList.remove('danger');
      caloriesRemainingEl.parentElement.classList.add('success');
      progressBarEl.classList.remove('danger');
      progressBarEl.classList.add('success');
    }
  }

  _displayCaloriesProgress() {
    const progressBarEl = document.querySelector('.progress-bar');
    const percentage = (this._totalCalories / this._caloriesLimit) * 100;
    progressBarEl.style.width = `${Math.min(percentage, 100)}%`;
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = `${Date.now()}${Math.random().toString().slice(2)}`;
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories){
    this.id = `${Date.now()}${Math.random().toString().slice(5)}`;
    this.name = name;
    this.calories = calories;
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this))
    document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this))
  }

  _newMeal(e) {
    e.preventDefault();
    const name = document.getElementById('meal-name');
    const calories = document.getElementById('meal-calories');

    // Validate inputs
    if (name.value === '' || calories.value === '') {
      alert('Please fill in the fileds');
      return;
    }

    const meal = new Meal(name.value, +calories.value);
    this._tracker.addMeal(meal);

    name.value = '';
    calories.value = '';
  }

  _newWorkout(e) {
    e.preventDefault();
    const name = document.getElementById('workout-name');
    const calories = document.getElementById('workout-calories');

    // Validate inputs
    if (name.value === '' || calories.value === '') {
      alert('Please fill in the fileds');
      return;
    }

    const workout = new Workout(name.value, +calories.value);
    this._tracker.addWorkout(workout);

    name.value = '';
    calories.value = '';
  }
}

const app = new App();
