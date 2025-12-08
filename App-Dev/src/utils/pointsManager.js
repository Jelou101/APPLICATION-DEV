class PointsManager {
  constructor() {
    this.listeners = new Set();
    this.API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getPoints() {
    try {
      const token = localStorage.getItem('token');
      
      // Always show cached points first for instant display
      const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        // Guest user
        return {
          total_points: cachedUser.total_points || 1000,
          riddle_points: cachedUser.riddle_points || 0,
          logic_points: cachedUser.logic_points || 0,
          endurance_points: cachedUser.endurance_points || 0
        };
      }
  
      // Try to get fresh points from API (in background)
      try {
        const response = await fetch(`${this.API_BASE}/api/user-status/points`, {
          headers: this.getHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.total_points !== undefined) {
            // Update localStorage with fresh data
            cachedUser.total_points = data.total_points;
            cachedUser.riddle_points = data.riddle_points;
            cachedUser.logic_points = data.logic_points;
            cachedUser.endurance_points = data.endurance_points;
            localStorage.setItem('user', JSON.stringify(cachedUser));
            
            return {
              total_points: data.total_points,
              riddle_points: data.riddle_points,
              logic_points: data.logic_points,
              endurance_points: data.endurance_points
            };
          }
        }
      } catch (apiError) {
        console.warn('API fetch failed, using cached data:', apiError);
        // Continue with cached data
      }
      
      // Return cached data (fallback)
      return {
        total_points: cachedUser.total_points || 1000,
        riddle_points: cachedUser.riddle_points || 0,
        logic_points: cachedUser.logic_points || 0,
        endurance_points: cachedUser.endurance_points || 0
      };
      
    } catch (error) {
      console.error('Failed to fetch points:', error);
      
      // Final fallback
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        total_points: user.total_points || 1000,
        riddle_points: user.riddle_points || 0,
        logic_points: user.logic_points || 0,
        endurance_points: user.endurance_points || 0
      };
    }
  }

  async addGamePoints(gameMode, points) {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // 1. UPDATE LOCALSTORAGE IMMEDIATELY FOR INSTANT UI UPDATE
      if (!user.total_points) user.total_points = 1000;
      if (!user[`${gameMode}_points`]) user[`${gameMode}_points`] = 0;
      
      user.total_points += points;
      user[`${gameMode}_points`] += points;
      localStorage.setItem('user', JSON.stringify(user));
      
      // 2. NOTIFY LISTENERS IMMEDIATELY (UI updates in real-time)
      this.notifyListeners({
        total_points: user.total_points,
        riddle_points: user.riddle_points || 0,
        logic_points: user.logic_points || 0,
        endurance_points: user.endurance_points || 0
      });
      
      // 3. THEN SEND TO API IN THE BACKGROUND
      if (token) {
        // Update in backend
        const response = await fetch(`${this.API_BASE}/api/user-status/points/game`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ 
            game_mode: gameMode,
            points: points 
          })
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Update localStorage with confirmed data from API
          user.total_points = data.total_points;
          user[`${gameMode}_points`] = data.game_points;
          localStorage.setItem('user', JSON.stringify(user));
          
          // Notify listeners again with confirmed data
          this.notifyListeners({
            total_points: data.total_points,
            riddle_points: user.riddle_points,
            logic_points: user.logic_points,
            endurance_points: user.endurance_points
          });
          
          return data.total_points;
        }
      }
      
      // Return the locally updated points
      return user.total_points;
      
    } catch (error) {
      console.error('Failed to add game points:', error);
      // Points were already updated locally, so UI is still correct
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.total_points || 1000;
    }
  }

  updateLocalPoints(gameMode, pointsToAdd) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Initialize if not exist
    if (!user.total_points) user.total_points = 1000;
    if (!user[`${gameMode}_points`]) user[`${gameMode}_points`] = 0;
    
    // Update points
    user.total_points += pointsToAdd;
    user[`${gameMode}_points`] += pointsToAdd;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Notify listeners
    this.notifyListeners({
      total_points: user.total_points,
      riddle_points: user.riddle_points || 0,
      logic_points: user.logic_points || 0,
      endurance_points: user.endurance_points || 0
    });
    
    return user.total_points;
  }

  // NEW METHOD: Deduct points
  async deductPoints(points) {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // 1. UPDATE LOCALSTORAGE IMMEDIATELY
      if (!user.total_points) user.total_points = 1000;
      user.total_points = Math.max(0, user.total_points - points); // CHANGED: Can go below 1000
      localStorage.setItem('user', JSON.stringify(user));
      
      // 2. NOTIFY LISTENERS IMMEDIATELY
      this.notifyListeners({
        total_points: user.total_points,
        riddle_points: user.riddle_points || 0,
        logic_points: user.logic_points || 0,
        endurance_points: user.endurance_points || 0
      });
      
      // 3. SEND TO API IN BACKGROUND
      if (token) {
        await fetch(`${this.API_BASE}/api/user-status/points/deduct`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ 
            points: points,
            category: 'total'
          })
        }).catch(error => {
          console.warn('Failed to sync points deduction:', error);
        });
      }
      
      return user.total_points;
      
    } catch (error) {
      console.error('Failed to deduct points:', error);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.total_points || 1000;
    }
  }

  // NEW METHOD: Update points (alias for deduct/add)
  async updatePoints(action, points) {
    // This is just an alias for deductPoints when action is 'deduct'
    if (action === 'deduct') {
      return this.deductPoints(points);
    }
    
    // For 'add' action, use addGamePoints with default mode
    return this.addGamePoints('riddle', points);
  }

  // REAL-TIME UPDATES
  notifyListeners(newPointsData) {
    console.log('🔄 PointsManager: Notifying', this.listeners.size, 'listeners');
    console.log('📊 New points data:', newPointsData);
    
    // Notify all subscribed listeners
    this.listeners.forEach((callback, index) => {
      console.log(`📞 Calling listener ${index + 1}`);
      try {
        callback(newPointsData);
      } catch (error) {
        console.error(`❌ Listener ${index + 1} error:`, error);
      }
    });
    
    // ALSO dispatch a custom event for components that might miss the subscription
    window.dispatchEvent(new CustomEvent('pointsUpdated', {
      detail: newPointsData
    }));
  }

  subscribe(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
}

// SINGLE INSTANCE
export const pointsManager = new PointsManager();