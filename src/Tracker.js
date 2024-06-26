import Storage from './Storage';

class CalorieTracker {
  constructor() {
    this._caloriesLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

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

    document.getElementById('limit').value = this._caloriesLimit;
  }

  // Public methods/ API, can be called from outside the current class //
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeals(meal);
    this._displayNewItem(meal, 'meal');
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkouts(workout);
    this._displayNewItem(workout, 'workout');
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(caloriesLimit) {
    this._caloriesLimit = caloriesLimit;
    Storage.setCalorieLimit(caloriesLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach(meal => this._displayNewItem(meal, 'meal'));
    this._workouts.forEach(workout => this._displayNewItem(workout, 'workout'));
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

  _displayNewItem(item, type) {
    const { id, name, calories } = item;
    const itemsEl = document.getElementById(`${type}-items`);
    console.log(type);
    const itemEl = document.createElement('div');
    itemEl.classList.add(`${type}-item`, 'card');
    itemEl.setAttribute(`data-id`, id)
    itemEl.innerHTML = `
    <div class="card-text">
      <div class="card-name">${name}</div>
      <div class="card-calories">${calories}</div>
    </div>
    <button class="card-icon delete btn"><i class="fa-solid fa-trash"></i></button>`;
    itemsEl.appendChild(itemEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;