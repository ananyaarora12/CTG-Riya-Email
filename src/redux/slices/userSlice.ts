import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BADGES } from '../../utils/pointsCalculator';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface MonthlyActivity {
  month: string;
  hours: number;
}

export interface UserStats {
  totalEvents: number;
  totalHours: number;
  categoryDistribution: CategoryCount[];
  monthlyActivity: MonthlyActivity[];
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: number;
  points: number;
  level: number;
  nextLevelPoints: number;
  badgesEarned: string[];
  badges: Badge[];
  eventsAttended: string[];
  eventsRegistered: string[];
  hoursVolunteered: number;
  stats: UserStats;
}

interface UserState {
  profile: UserProfile | null;
  selectedProfile: UserProfile | null;
  leaderboard: UserProfile[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  selectedProfile: null,
  leaderboard: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.selectedProfile = action.payload;
      state.isLoading = false;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.selectedProfile = action.payload;
      state.isLoading = false;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addPointsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addPointsSuccess: (state, action: PayloadAction<{ 
      points: number; 
      newLevel: number;
      nextLevelPoints: number;
    }>) => {
      if (state.profile) {
        state.profile.points = action.payload.points;
        state.profile.level = action.payload.newLevel;
        state.profile.nextLevelPoints = action.payload.nextLevelPoints;
      }
      if (state.selectedProfile) {
        state.selectedProfile.points = action.payload.points;
        state.selectedProfile.level = action.payload.newLevel;
        state.selectedProfile.nextLevelPoints = action.payload.nextLevelPoints;
      }
      state.isLoading = false;
    },
    addPointsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerForEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerForEventSuccess: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.eventsRegistered.includes(action.payload)) {
        state.profile.eventsRegistered.push(action.payload);
      }
      if (state.selectedProfile && !state.selectedProfile.eventsRegistered.includes(action.payload)) {
        state.selectedProfile.eventsRegistered.push(action.payload);
      }
      state.isLoading = false;
    },
    registerForEventFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    completeEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    completeEventSuccess: (state, action: PayloadAction<{
      eventId: string;
      hours: number;
      category: string;
      earnedPoints: number;
      completedDate: string;
      eventMonth: string;
    }>) => {
      if (state.profile) {
        // Add to attended events if not already there
        if (!state.profile.eventsAttended.includes(action.payload.eventId)) {
          state.profile.eventsAttended.push(action.payload.eventId);
        }
        
        // Update hours volunteered
        state.profile.hoursVolunteered += action.payload.hours;
        
        // Update category distribution
        const categoryIndex = state.profile.stats.categoryDistribution.findIndex(
          cat => cat.name === action.payload.category
        );
        
        if (categoryIndex >= 0) {
          state.profile.stats.categoryDistribution[categoryIndex].count += 1;
        } else {
          state.profile.stats.categoryDistribution.push({
            name: action.payload.category,
            count: 1
          });
        }
        
        // Update monthly activity
        const monthIndex = state.profile.stats.monthlyActivity.findIndex(
          activity => activity.month === action.payload.eventMonth
        );
        
        if (monthIndex >= 0) {
          state.profile.stats.monthlyActivity[monthIndex].hours += action.payload.hours;
        } else {
          state.profile.stats.monthlyActivity.push({
            month: action.payload.eventMonth,
            hours: action.payload.hours
          });
        }
        
        // Update total events count
        state.profile.stats.totalEvents += 1;
        state.profile.stats.totalHours += action.payload.hours;
      }
      
      // Apply the same changes to selectedProfile if it exists
      if (state.selectedProfile) {
        if (!state.selectedProfile.eventsAttended.includes(action.payload.eventId)) {
          state.selectedProfile.eventsAttended.push(action.payload.eventId);
        }
        state.selectedProfile.hoursVolunteered += action.payload.hours;
        
        const categoryIndex = state.selectedProfile.stats.categoryDistribution.findIndex(
          cat => cat.name === action.payload.category
        );
        
        if (categoryIndex >= 0) {
          state.selectedProfile.stats.categoryDistribution[categoryIndex].count += 1;
        } else {
          state.selectedProfile.stats.categoryDistribution.push({
            name: action.payload.category,
            count: 1
          });
        }
        
        const monthIndex = state.selectedProfile.stats.monthlyActivity.findIndex(
          activity => activity.month === action.payload.eventMonth
        );
        
        if (monthIndex >= 0) {
          state.selectedProfile.stats.monthlyActivity[monthIndex].hours += action.payload.hours;
        } else {
          state.selectedProfile.stats.monthlyActivity.push({
            month: action.payload.eventMonth,
            hours: action.payload.hours
          });
        }
        
        state.selectedProfile.stats.totalEvents += 1;
        state.selectedProfile.stats.totalHours += action.payload.hours;
      }
      
      state.isLoading = false;
    },
    completeEventFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    earnBadgeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    earnBadgeSuccess: (state, action: PayloadAction<{
      badgeId: string;
      earnedDate: string;
    }>) => {
      if (state.profile) {
        // Check if badge is already earned
        if (!state.profile.badgesEarned.includes(action.payload.badgeId)) {
          state.profile.badgesEarned.push(action.payload.badgeId);
          
          // Add badge details to the badges array
          const badgeDetails = BADGES[action.payload.badgeId as keyof typeof BADGES];
          if (badgeDetails) {
            state.profile.badges.push({
              id: badgeDetails.id,
              name: badgeDetails.name,
              description: badgeDetails.description,
              icon: badgeDetails.icon,
              earnedDate: action.payload.earnedDate
            });
          }
        }
      }
      
      if (state.selectedProfile) {
        if (!state.selectedProfile.badgesEarned.includes(action.payload.badgeId)) {
          state.selectedProfile.badgesEarned.push(action.payload.badgeId);
          
          const badgeDetails = BADGES[action.payload.badgeId as keyof typeof BADGES];
          if (badgeDetails) {
            state.selectedProfile.badges.push({
              id: badgeDetails.id,
              name: badgeDetails.name,
              description: badgeDetails.description,
              icon: badgeDetails.icon,
              earnedDate: action.payload.earnedDate
            });
          }
        }
      }
      
      state.isLoading = false;
    },
    earnBadgeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Leaderboard actions
    fetchLeaderboardStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLeaderboardSuccess: (state, action: PayloadAction<UserProfile[]>) => {
      state.leaderboard = action.payload;
      state.isLoading = false;
    },
    fetchLeaderboardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearUserState: (state) => {
      return initialState;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  addPointsStart,
  addPointsSuccess,
  addPointsFailure,
  registerForEventStart,
  registerForEventSuccess,
  registerForEventFailure,
  completeEventStart,
  completeEventSuccess,
  completeEventFailure,
  earnBadgeStart,
  earnBadgeSuccess,
  earnBadgeFailure,
  fetchLeaderboardStart,
  fetchLeaderboardSuccess,
  fetchLeaderboardFailure,
  clearUserState,
} = userSlice.actions;

export default userSlice.reducer; 