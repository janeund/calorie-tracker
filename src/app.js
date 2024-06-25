import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';
import './scss/style.scss';

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
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
