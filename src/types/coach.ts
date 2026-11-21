export interface CoachStint {
  club: string;
  startDate?: string;
  endDate?: string;
  interim?: boolean;
}

export interface Coach {
  id: string;
  name: string;
  stints: CoachStint[];
}