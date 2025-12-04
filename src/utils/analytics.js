import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Track user sign-in
export const trackSignIn = async (userId, email) => {
  try {
    await addDoc(collection(db, 'analytics_signins'), {
      userId,
      email,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking sign-in:', error);
  }
};

// Track page visit
export const trackPageVisit = async (userId, email) => {
  try {
    await addDoc(collection(db, 'analytics_visits'), {
      userId,
      email,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
};

// Track grade comparison
export const trackGradeComparison = async (userId, email, grades) => {
  try {
    await addDoc(collection(db, 'analytics_comparisons'), {
      userId,
      email,
      grades: grades.sort(), // Sort for consistency
      gradeCount: grades.length,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking comparison:', error);
  }
};

