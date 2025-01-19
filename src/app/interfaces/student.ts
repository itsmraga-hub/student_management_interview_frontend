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


export interface PhotoPath {
  photoUrl: string;
  message: string;
}