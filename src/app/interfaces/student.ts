export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  studentClass: string;
  score: number;
  status: number;
  photoPath: string;
  dob: string;
}

export interface SelectedStudent {
  studentId: number,
  name: string,
  score: number
}


export interface PhotoPath {
  photoUrl: string;
  message: string;
}

export interface Response {
  message: string;
}