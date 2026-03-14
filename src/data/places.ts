export interface Place {
  id: string;
  name: string;
  building: string;
  floor: string;
  category: string;
  description: string;
  directions: string;
  imageUrl?: string;
  floorPlanUrl?: string;
  hours?: string;
  accessibility?: string;
  contact?: string;
}

export const DEFAULT_PLACES: Place[] = [
  {
    id: "1",
    name: "UCSC Library",
    building: "Main Building",
    floor: "2nd Floor",
    category: "Library",
    description: "Main library for UCSC students with a wide collection of books and study areas.",
    directions: "Take the main staircase to the 2nd floor. The entrance is immediately visible near the bag lockers."
  },
  {
    id: "2",
    name: "S104 (Main Lecture Hall)",
    building: "Main Building",
    floor: "1st Floor",
    category: "Lecture Hall",
    description: "Large lecture hall used for main batch lectures.",
    directions: "From the main entrance, walk past the UCSC Computer Museum. It is the large hall on the right."
  },
  {
    id: "3",
    name: "Lab A (Software Engineering Lab)",
    building: "Main Building",
    floor: "1st Floor",
    category: "Lab",
    description: "Computer laboratory primarily used for software engineering practical sessions.",
    directions: "Located in the west wing of the 1st floor. Walk past the Student Common Room and turn left."
  },
  {
    id: "4",
    name: "Lab B (Computer Lab 1)",
    building: "Main Building",
    floor: "1st Floor",
    category: "Lab",
    description: "General purpose computer laboratory for students.",
    directions: "Located in the west wing of the 1st floor, right next to Lab A."
  },
  {
    id: "5",
    name: "Academic & Publications Division (Student Affairs)",
    building: "Main Building",
    floor: "1st Floor",
    category: "Office",
    description: "Handles student affairs, academic matters, and publications.",
    directions: "1st floor, central block, between the NOC and Examinations Division."
  },
  {
    id: "6",
    name: "UCSC Canteen",
    building: "Main Building",
    floor: "Ground Floor",
    category: "Canteen",
    description: "Student canteen serving meals, snacks, and beverages.",
    directions: "Located on the ground floor near the student recreation area."
  },
  {
    id: "7",
    name: "Examinations & Registrations Division (Registrar Office)",
    building: "Main Building",
    floor: "1st Floor",
    category: "Office",
    description: "Handles student registrations, exams, and issuing of transcripts.",
    directions: "1st floor, east wing. Walk towards the waiting lobby and Shroff counter."
  },
  {
    id: "8",
    name: "Network Operating Center (Network Lab)",
    building: "Main Building",
    floor: "1st Floor",
    category: "Lab",
    description: "Handles UCSC network infrastructure and serves as a specialized network lab.",
    directions: "1st floor, central block, next to the Student Common Room."
  },
  {
    id: "9",
    name: "Mini Auditorium / E205",
    building: "Main Building",
    floor: "2nd Floor",
    category: "Lecture Hall",
    description: "Medium-sized auditorium for guest lectures and special sessions.",
    directions: "Take the main staircase to the 2nd floor and walk straight past the Library along the main corridor. It is located just past the Library."
  },
  {
    id: "10",
    name: "Vidya Jyothi Professor V K Samaranayake Auditorium",
    building: "Main Building",
    floor: "4th Floor",
    category: "Lecture Hall",
    description: "The main auditorium for large events, inaugurations, and conferences.",
    directions: "Take the main staircase all the way up to the 4th floor. Walk past the Finance Division and the 4th Floor Lecture Hall (E401) to reach the auditorium."
  }
];
