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

  // Public methods/ API, can be called from outside the current class //
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._displayNewItem(meal, 'meal');
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayNewItem(workout, 'workout');
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      this._meals.splice(index, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._render();
  }

  setLimit(caloriesLimit) {
    this._caloriesLimit = caloriesLimit;
    this._displayCaloriesLimit();
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
    document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
    document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
    document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
    document.getElementById('filter-meals-input').addEventListener('keyup', this._filterItems.bind(this, 'meal'));
    document.getElementById('filter-workouts-input').addEventListener('keyup', this._filterItems.bind(this, 'workout'));
    document.getElementById('set-limit-btn').addEventListener('click', this._openModal.bind(this));
    document.getElementById('btn-close').addEventListener('click', this._closeModal.bind(this));
    document.getElementById('reset-limit-btn').addEventListener('click', this._reset.bind(this));
    document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate inputs
    // if (name.value === '' || calories.value === '') {
    //   alert('Please fill in the fileds');
    //   return;
    // }

    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';
  }

  _removeItem(type, e) {
    if (e.target.classList.contains('delete') || e.target.classList.contains('fa-trash')) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');
        
        type === 'meal'
        ? this._tracker.removeMeal(id)
        : this._tracker.removeWorkout(id);

        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      console.log(name);
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    })
  }

  _reset() {
    // reset for calories, arrays
    this._tracker.reset(); 

    // reset for DOM (new added items in list) 
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals-input').value = '';
    document.getElementById('filter-workouts-input').value = '';
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById('limit');

    // validate input from
    if (limit.value === '') {
      alert('Please enter the value');
      return;
    }

    // initiate set limit method from Tracker class
    this._tracker.setLimit(+limit.value);
    limit.value = '';

    // close/hide modal after submiting form
    const modalEl = document.querySelector('.calorie-limit-modal');
    modalEl.style.display = 'none';
    
  }

  _openModal() {
    const modalEl = document.querySelector('.calorie-limit-modal');
    modalEl.style.display = 'block';
  }

  _closeModal() {
    const modalEl = document.querySelector('.calorie-limit-modal');
    modalEl.style.display = 'none';
  }
}

const app = new App();
