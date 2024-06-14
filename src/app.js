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
    const remaining = this._caloriesLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
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

const tracker = new CalorieTracker();

const breakfast = new Meal('breakfest', 400);
const run = new Workout('run', 200);

tracker.addMeal(breakfast);
tracker.addWorkout(run);
console.log(tracker);
