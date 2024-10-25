import { Injectable } from '@angular/core';
import { LEVELS, SUBJECTS } from '../constants/academics';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  constructor() {}

  getAcademicSurveyQuestion() {
    const subject = this.getRandomSubject();
    const level = this.getWeightedRandomLevel();

    return {
      contentType: 'html',
      title: 'Tell us about your classes',
      question: `Are you taking ${subject.name}? <strong>${subject.code} - ${level.level}</strong>`,
      value: ''
    };
  }

  private getRandomSubject() {
    return SUBJECTS[Math.floor(SUBJECTS.length * Math.random())];
  }

  private getWeightedRandomLevel() {
    const randomNum =
      Math.random() * LEVELS.reduce((acc, curr) => acc + curr.weight, 0);

    let cumulativeWeight = 0;

    for (const level of LEVELS) {
      cumulativeWeight += level.weight;

      if (randomNum <= cumulativeWeight) {
        return level; // Return the selected level based on weight
      }
    }

    // Fallback in case of an error
    return LEVELS[0];
  }
}
