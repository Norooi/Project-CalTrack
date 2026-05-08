// API Configuration
const API = 'http://localhost:8080/api';

// Global state
let currentType = 'MEAL';
let tdeeGoal = null;

// Helper functions
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function hideErr(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = 'none';
  }
}

function toast(msg, type = 'info', duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  
  t.textContent = msg;
  t.className = `show ${type}`;
  
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => {
      t.className = '';
    }, 300);
  }, duration);
}

// Server health check
async function checkServer() {
  const pill = document.getElementById('serverStatus');
  const label = document.getElementById('statusLabel');
  
  if (!pill || !label) return;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const res = await fetch(`${API}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      pill.className = 'up';
      label.textContent = 'Server Online';
      toast('✅ Connected to Spring Boot!', 'ok');
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (e) {
    pill.className = 'down';
    label.textContent = 'Server Offline';
    toast(`❌ Cannot reach server: ${e.message} — is Spring Boot running?`, 'err', 6000);
  }
}

// Calorie Calculator Module
const calorieCalculator = {
  calculate() {
    const age = parseInt(document.getElementById('age')?.value);
    const gender = document.getElementById('gender')?.value;
    const weight = parseFloat(document.getElementById('weight')?.value);
    const height = parseFloat(document.getElementById('height')?.value);
    const activity = document.getElementById('activity')?.value;
    
    const errorEl = document.getElementById('calcError');
    
    // Validation
    if (!age || !weight || !height) {
      showErr('calcError', 'Please fill in age, weight, and height');
      return;
    }
    
    if (age < 10 || age > 120) {
      showErr('calcError', 'Age must be between 10 and 120');
      return;
    }
    
    if (weight < 20 || weight > 300) {
      showErr('calcError', 'Weight must be between 20 and 300 kg');
      return;
    }
    
    if (height < 50 || height > 280) {
      showErr('calcError', 'Height must be between 50 and 280 cm');
      return;
    }
    
    hideErr('calcError');
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = Math.round(bmr * (activityMultipliers[activity] || 1.55));
    tdeeGoal = tdee;
    
    // Display result
    const resultDiv = document.getElementById('calcResult');
    const tdeeEl = document.getElementById('calcTDEE');
    const detailEl = document.getElementById('calcDetail');
    
    if (resultDiv && tdeeEl && detailEl) {
      tdeeEl.textContent = tdee;
      detailEl.innerHTML = `Based on ${gender === 'male' ? 'male' : 'female'}, ${age} yrs, ${weight}kg, ${height}cm<br>Activity: ${activity.replace('_', ' ')}`;
      resultDiv.style.display = 'block';
      
      // Update goal display
      const goalEl = document.getElementById('sumGoal');
      if (goalEl) {
        goalEl.innerHTML = `${tdee} kcal`;
      }
      
      toast(`TDEE calculated: ${tdee} kcal/day`, 'ok');
    }
  }
};

// Entry Manager Module
const entryManager = {
  async addEntry() {
    const name = document.getElementById('mealName')?.value.trim();
    const calories = parseInt(document.getElementById('mealCalories')?.value);
    const date = document.getElementById('mealDate')?.value;
    
    // Validation
    if (!name) {
      showErr('addError', 'Please enter a name');
      return;
    }
    
    if (!calories || calories < 1) {
      showErr('addError', 'Please enter valid calories (minimum 1)');
      return;
    }
    
    if (!date) {
      showErr('addError', 'Please select a date');
      return;
    }
    
    hideErr('addError');
    
    const entry = {
      name: name,
      calories: calories,
      type: currentType,
      date: date
    };
    
    try {
      const response = await fetch(`${API}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      toast(`✅ ${currentType === 'MEAL' ? 'Meal' : 'Workout'} added successfully!`, 'ok');
      
      // Clear form
      document.getElementById('mealName').value = '';
      document.getElementById('mealCalories').value = '';
      document.getElementById('mealDate').value = todayStr();
      
      // Refresh data
      await this.loadMeals();
      await this.loadTodaySummary();
      
    } catch (error) {
      console.error('Error adding entry:', error);
      showErr('addError', `Failed to add entry: ${error.message}`);
      toast('❌ Failed to add entry', 'err');
    }
  },
  
  async deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API}/entries/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      toast('✅ Entry deleted successfully', 'ok');
      await this.loadMeals();
      await this.loadTodaySummary();
      
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast('❌ Failed to delete entry', 'err');
    }
  },
  
  async loadMeals() {
    const filterDate = document.getElementById('filterDate')?.value;
    const mealsList = document.getElementById('mealsList');
    
    if (!mealsList) return;
    
    try {
      let url = `${API}/entries`;
      if (filterDate) {
        url += `?date=${filterDate}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const entries = await response.json();
      
      if (!entries || entries.length === 0) {
        mealsList.innerHTML = '<div class="empty-state"><div class="ei">🍽️</div><p>No entries found!</p></div>';
        return;
      }
      
      // Render entries
      mealsList.innerHTML = entries.map(entry => `
        <div class="meal-row ${entry.type === 'WORKOUT' ? 'workout' : 'meal-entry'}">
          <div class="meal-info">
            <div class="meal-name">${this.escapeHtml(entry.name)}</div>
            <div class="meal-meta">${entry.date} • ${entry.type === 'WORKOUT' ? '🏋️ Workout' : '🍽 Meal'}</div>
          </div>
          <div class="meal-cal ${entry.type === 'WORKOUT' ? 'neg' : 'pos'}">
            ${entry.type === 'WORKOUT' ? '-' : '+'}${entry.calories} kcal
          </div>
          <div class="meal-actions">
            <button class="btn btn-delete" onclick='window.entryManager.deleteEntry(${JSON.stringify(entry.id)})'>Delete</button>
          </div>
        </div>
      `).join('');
      
    } catch (error) {
      console.error('Error loading entries:', error);
      mealsList.innerHTML = '<div class="empty-state"><div class="ei">⚠️</div><p>Error loading entries</p></div>';
      toast('❌ Failed to load entries', 'err');
    }
  },
  
  async loadTodaySummary() {
    const today = todayStr();
    
    try {
      const response = await fetch(`${API}/summary?date=${today}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const summary = await response.json();
      
      // Update summary display
      const netEl = document.getElementById('sumNet');
      const consumedEl = document.getElementById('sumConsumed');
      const burnedEl = document.getElementById('sumBurned');
      
      if (netEl) netEl.textContent = summary.netCalories || 0;
      if (consumedEl) consumedEl.textContent = summary.totalConsumed || 0;
      if (burnedEl) burnedEl.textContent = summary.totalBurned || 0;
      
    } catch (error) {
      console.error('Error loading summary:', error);
      // Don't show toast for summary errors to avoid spam
    }
  },
  
  setType(type) {
    currentType = type;
    
    const btnMeal = document.getElementById('btnMeal');
    const btnWorkout = document.getElementById('btnWorkout');
    const addBtn = document.getElementById('addBtn');
    const nameLabel = document.getElementById('nameLabel');
    const calLabel = document.getElementById('calLabel');
    
    if (type === 'MEAL') {
      btnMeal?.classList.add('active-meal');
      btnWorkout?.classList.remove('active-workout');
      if (addBtn) addBtn.textContent = 'Add Meal';
      if (nameLabel) nameLabel.textContent = 'Meal Name';
      if (calLabel) calLabel.textContent = 'Calories';
    } else {
      btnWorkout?.classList.add('active-workout');
      btnMeal?.classList.remove('active-meal');
      if (addBtn) addBtn.textContent = 'Add Workout';
      if (nameLabel) nameLabel.textContent = 'Workout Name';
      if (calLabel) calLabel.textContent = 'Calories Burned';
    }
  },
  
  clearFilter() {
    const filterDate = document.getElementById('filterDate');
    if (filterDate) {
      filterDate.value = '';
    }
    this.loadMeals();
  },
  
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const today = todayStr();
  
  const mealDateInput = document.getElementById('mealDate');
  const filterDateInput = document.getElementById('filterDate');
  const headerDateEl = document.getElementById('headerDate');
  
  if (mealDateInput) mealDateInput.value = today;
  if (filterDateInput) filterDateInput.value = today;
  if (headerDateEl) {
    headerDateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Make modules available globally
  window.calorieCalculator = calorieCalculator;
  window.entryManager = entryManager;
  
  // Check server and load data
  await checkServer();
  await entryManager.loadMeals();
  await entryManager.loadTodaySummary();
});